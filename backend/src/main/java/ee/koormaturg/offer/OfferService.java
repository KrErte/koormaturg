package ee.koormaturg.offer;

import ee.koormaturg.carrier.CarrierRepository;
import ee.koormaturg.listing.FreightListing;
import ee.koormaturg.listing.ListingRepository;
import ee.koormaturg.offer.dto.CreateOfferRequest;
import ee.koormaturg.payment.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OfferService {

    private final OfferRepository offerRepository;
    private final ListingRepository listingRepository;
    private final CarrierRepository carrierRepository;
    private final PaymentService paymentService;

    @Value("${app.payment-deadline-hours}")
    private int paymentDeadlineHours;

    @Transactional
    public FreightOffer create(Long userId, Long listingId, CreateOfferRequest req) {
        var carrier = carrierRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Vedaja profiili ei leitud"));

        if (!carrier.getVerified()) {
            throw new IllegalArgumentException("Vedaja pole kinnitatud");
        }

        var listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new IllegalArgumentException("Vedu ei leitud"));

        if (listing.getStatus() != FreightListing.ListingStatus.OPEN) {
            throw new IllegalArgumentException("Vedu pole avatud");
        }

        if (offerRepository.existsByListingIdAndCarrierId(listingId, carrier.getId())) {
            throw new IllegalArgumentException("Oled juba pakkumise teinud");
        }

        var offer = FreightOffer.builder()
                .listing(listing)
                .carrier(carrier)
                .priceEur(req.priceEur())
                .message(req.message())
                .build();
        return offerRepository.save(offer);
    }

    public List<FreightOffer> getByListing(Long userId, Long listingId) {
        var listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new IllegalArgumentException("Vedu ei leitud"));
        if (!listing.getPostedBy().getId().equals(userId)) {
            throw new SecurityException("Pole sinu postitus");
        }
        return offerRepository.findByListingIdOrderByCreatedAtDesc(listingId);
    }

    public List<FreightOffer> getByCarrier(Long userId) {
        var carrier = carrierRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Vedaja profiili ei leitud"));
        return offerRepository.findByCarrierIdOrderByCreatedAtDesc(carrier.getId());
    }

    @Transactional
    public FreightOffer accept(Long userId, Long listingId, Long offerId) {
        var listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new IllegalArgumentException("Vedu ei leitud"));
        if (!listing.getPostedBy().getId().equals(userId)) {
            throw new SecurityException("Pole sinu postitus");
        }
        if (listing.getStatus() != FreightListing.ListingStatus.OPEN) {
            throw new IllegalArgumentException("Vedu pole avatud");
        }

        var offer = offerRepository.findById(offerId)
                .orElseThrow(() -> new IllegalArgumentException("Pakkumist ei leitud"));
        if (!offer.getListing().getId().equals(listingId)) {
            throw new IllegalArgumentException("Pakkumine ei kuulu sellele veole");
        }

        offer.setStatus(FreightOffer.OfferStatus.ACCEPTED);
        listing.setAcceptedCarrier(offer.getCarrier());
        listing.setAcceptedPriceEur(offer.getPriceEur());
        listing.setAcceptedAt(Instant.now());
        listing.setPaymentDeadline(Instant.now().plusSeconds((long) paymentDeadlineHours * 3600));

        // Create Stripe PI
        String piId = paymentService.createPaymentIntent(listing.getId(), offer.getId(), userId);
        listing.setStripePaymentIntentId(piId);

        listingRepository.save(listing);
        return offerRepository.save(offer);
    }

    @Transactional
    public FreightOffer reject(Long userId, Long listingId, Long offerId) {
        var listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new IllegalArgumentException("Vedu ei leitud"));
        if (!listing.getPostedBy().getId().equals(userId)) {
            throw new SecurityException("Pole sinu postitus");
        }

        var offer = offerRepository.findById(offerId)
                .orElseThrow(() -> new IllegalArgumentException("Pakkumist ei leitud"));
        offer.setStatus(FreightOffer.OfferStatus.REJECTED);
        return offerRepository.save(offer);
    }
}
