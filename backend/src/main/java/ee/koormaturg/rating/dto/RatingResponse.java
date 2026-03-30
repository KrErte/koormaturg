package ee.koormaturg.rating.dto;

import ee.koormaturg.rating.FreightRating;
import java.time.Instant;

public record RatingResponse(
        Long id,
        Long listingId,
        String ratedByName,
        Integer stars,
        String comment,
        Instant createdAt
) {
    public static RatingResponse from(FreightRating r) {
        return new RatingResponse(r.getId(), r.getListing().getId(),
                r.getRatedBy().getFullName(), r.getStars(), r.getComment(), r.getCreatedAt());
    }
}
