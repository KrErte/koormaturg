package ee.koormaturg.payment;

import ee.koormaturg.listing.FreightListing;
import ee.koormaturg.listing.ListingRepository;
import ee.koormaturg.offer.FreightOffer;
import ee.koormaturg.offer.OfferRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Component
@RequiredArgsConstructor
@Slf4j
public class PaymentDeadlineJob {

    private final ListingRepository listingRepository;
    private final OfferRepository offerRepository;

    @Scheduled(fixedRate = 300_000) // every 5 minutes
    @Transactional
    public void checkExpiredPayments() {
        var expired = listingRepository.findByStatusAndPaymentDeadlineBefore(
                FreightListing.ListingStatus.OPEN, Instant.now());

        for (var listing : expired) {
            if (listing.getServiceFeePaid()) continue;
            if (listing.getAcceptedCarrier() == null) continue;

            log.info("Payment deadline expired for listing #{}", listing.getId());

            // Reset listing
            listing.setAcceptedCarrier(null);
            listing.setAcceptedPriceEur(null);
            listing.setAcceptedAt(null);
            listing.setPaymentDeadline(null);
            listing.setStripePaymentIntentId(null);
            listing.setStatus(FreightListing.ListingStatus.OPEN);
            listingRepository.save(listing);

            // Reset offers
            var offers = offerRepository.findByListingIdOrderByCreatedAtDesc(listing.getId());
            for (var offer : offers) {
                if (offer.getStatus() == FreightOffer.OfferStatus.ACCEPTED) {
                    offer.setStatus(FreightOffer.OfferStatus.EXPIRED);
                    offerRepository.save(offer);
                }
            }
        }
    }
}
