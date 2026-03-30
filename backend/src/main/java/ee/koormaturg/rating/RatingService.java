package ee.koormaturg.rating;

import ee.koormaturg.carrier.CarrierRepository;
import ee.koormaturg.listing.FreightListing;
import ee.koormaturg.listing.ListingRepository;
import ee.koormaturg.rating.dto.CreateRatingRequest;
import ee.koormaturg.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepository;
    private final ListingRepository listingRepository;
    private final UserRepository userRepository;
    private final CarrierRepository carrierRepository;

    @Transactional
    public FreightRating create(Long userId, Long listingId, CreateRatingRequest req) {
        var listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new IllegalArgumentException("Vedu ei leitud"));

        if (listing.getStatus() != FreightListing.ListingStatus.COMPLETED) {
            throw new IllegalArgumentException("Hinnangut saab anda ainult lõpetatud veole");
        }
        if (listing.getAcceptedCarrier() == null) {
            throw new IllegalArgumentException("Veol pole vedajat");
        }
        if (ratingRepository.existsByListingIdAndRatedById(listingId, userId)) {
            throw new IllegalArgumentException("Oled juba hinnangu andnud");
        }

        var user = userRepository.findById(userId).orElseThrow();
        var rating = FreightRating.builder()
                .listing(listing)
                .ratedBy(user)
                .carrier(listing.getAcceptedCarrier())
                .stars(req.stars())
                .comment(req.comment())
                .build();
        rating = ratingRepository.save(rating);

        // Update carrier avg rating
        var carrier = listing.getAcceptedCarrier();
        Double avg = ratingRepository.averageByCarrierId(carrier.getId());
        long count = ratingRepository.countByCarrierId(carrier.getId());
        carrier.setRatingAvg(avg != null ? BigDecimal.valueOf(avg).setScale(2, RoundingMode.HALF_UP) : null);
        carrier.setRatingCount((int) count);
        carrierRepository.save(carrier);

        return rating;
    }

    public List<FreightRating> getByCarrier(Long carrierId) {
        return ratingRepository.findByCarrierIdOrderByCreatedAtDesc(carrierId);
    }
}
