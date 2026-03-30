package ee.koormaturg.payment;

import com.stripe.Stripe;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.net.Webhook;
import com.stripe.param.PaymentIntentCreateParams;
import ee.koormaturg.listing.FreightListing;
import ee.koormaturg.listing.ListingRepository;
import ee.koormaturg.notification.NotificationService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final ListingRepository listingRepository;
    private final NotificationService notificationService;

    @Value("${stripe.secret-key}")
    private String stripeSecretKey;

    @Value("${stripe.webhook-secret}")
    private String webhookSecret;

    @Value("${stripe.service-fee-cents}")
    private long serviceFeeCents;

    @PostConstruct
    void init() {
        Stripe.apiKey = stripeSecretKey;
    }

    public String createPaymentIntent(Long listingId, Long offerId, Long userId) {
        try {
            var params = PaymentIntentCreateParams.builder()
                    .setAmount(serviceFeeCents)
                    .setCurrency("eur")
                    .setDescription("Koormaturg teenustasu — vedu #" + listingId)
                    .putMetadata("listing_id", String.valueOf(listingId))
                    .putMetadata("offer_id", String.valueOf(offerId))
                    .putMetadata("user_id", String.valueOf(userId))
                    .build();
            PaymentIntent pi = PaymentIntent.create(params);
            return pi.getId();
        } catch (StripeException e) {
            throw new RuntimeException("Stripe viga: " + e.getMessage(), e);
        }
    }

    public String getClientSecret(Long listingId, Long userId) {
        var listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new IllegalArgumentException("Vedu ei leitud"));
        if (!listing.getPostedBy().getId().equals(userId)) {
            throw new SecurityException("Pole sinu postitus");
        }
        if (listing.getStripePaymentIntentId() == null) {
            throw new IllegalArgumentException("Makse pole veel loodud");
        }
        try {
            PaymentIntent pi = PaymentIntent.retrieve(listing.getStripePaymentIntentId());
            return pi.getClientSecret();
        } catch (StripeException e) {
            throw new RuntimeException("Stripe viga: " + e.getMessage(), e);
        }
    }

    @Transactional
    public void handleWebhook(String payload, String sigHeader) {
        Event event;
        try {
            event = Webhook.constructEvent(payload, sigHeader, webhookSecret);
        } catch (SignatureVerificationException e) {
            throw new IllegalArgumentException("Kehtetu webhook signatuur");
        }

        if ("payment_intent.succeeded".equals(event.getType())) {
            var piObject = (PaymentIntent) event.getDataObjectDeserializer()
                    .getObject().orElseThrow();
            String listingIdStr = piObject.getMetadata().get("listing_id");
            Long listingId = Long.parseLong(listingIdStr);

            var listing = listingRepository.findById(listingId).orElseThrow();
            listing.setServiceFeePaid(true);
            listing.setStatus(FreightListing.ListingStatus.MATCHED);
            listingRepository.save(listing);

            notificationService.sendPaymentConfirmed(listing);
        }
    }
}
