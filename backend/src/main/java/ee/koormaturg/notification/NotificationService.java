package ee.koormaturg.notification;

import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import ee.koormaturg.listing.FreightListing;
import ee.koormaturg.offer.FreightOffer;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class NotificationService {

    @Value("${resend.api-key}")
    private String apiKey;

    @Value("${resend.from}")
    private String from;

    private Resend resend;

    @PostConstruct
    void init() {
        resend = new Resend(apiKey);
    }

    @Async
    public void sendNewOffer(FreightListing listing, FreightOffer offer) {
        sendEmail(listing.getPostedBy().getEmail(),
                "Uus pakkumine veole #" + listing.getId(),
                "Tere, " + listing.getPostedBy().getFullName() + "!\n\n"
                + "Sinu veole \"" + listing.getTitle() + "\" on tehtud uus pakkumine: "
                + offer.getPriceEur() + " EUR.\n\n"
                + "Vaata pakkumisi: https://koormaturg.ee/veod/" + listing.getId());
    }

    @Async
    public void sendOfferAccepted(FreightOffer offer) {
        var listing = offer.getListing();
        var carrier = offer.getCarrier();
        sendEmail(carrier.getUser().getEmail(),
                "Pakkumine aktsepteeritud — vedu #" + listing.getId(),
                "Tere, " + carrier.getUser().getFullName() + "!\n\n"
                + "Sinu pakkumine veole \"" + listing.getTitle() + "\" on aktsepteeritud!\n"
                + "Poster: " + listing.getPostedBy().getFullName()
                + " (" + listing.getPostedBy().getEmail() + ")\n\n"
                + "Ootame makse kinnitust.");
    }

    @Async
    public void sendPaymentConfirmed(FreightListing listing) {
        String posterMsg = "Makse kinnitatud! Vedu #" + listing.getId() + " on nüüd kinnitatud.";
        sendEmail(listing.getPostedBy().getEmail(), "Makse kinnitatud — vedu #" + listing.getId(), posterMsg);

        if (listing.getAcceptedCarrier() != null) {
            String carrierMsg = "Makse kinnitatud! Vedu #" + listing.getId() + " on nüüd kinnitatud.\n"
                    + "Poster: " + listing.getPostedBy().getFullName()
                    + " (" + listing.getPostedBy().getEmail() + ")";
            sendEmail(listing.getAcceptedCarrier().getUser().getEmail(),
                    "Makse kinnitatud — vedu #" + listing.getId(), carrierMsg);
        }
    }

    @Async
    public void sendCarrierVerified(String email, String name) {
        sendEmail(email, "Profiil kinnitatud!",
                "Tere, " + name + "!\n\n"
                + "Sinu vedaja profiil on kinnitatud. Nüüd saad pakkumisi teha.\n\n"
                + "Mine veoturg: https://koormaturg.ee/veod");
    }

    private void sendEmail(String to, String subject, String body) {
        try {
            var params = CreateEmailOptions.builder()
                    .from(from)
                    .to(to)
                    .subject(subject)
                    .text(body)
                    .build();
            resend.emails().send(params);
        } catch (ResendException e) {
            log.error("Email saatmine ebaõnnestus: {} — {}", to, e.getMessage());
        }
    }
}
