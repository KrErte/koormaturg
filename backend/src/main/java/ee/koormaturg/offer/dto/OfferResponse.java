package ee.koormaturg.offer.dto;

import ee.koormaturg.offer.FreightOffer;
import java.math.BigDecimal;
import java.time.Instant;

public record OfferResponse(
        Long id,
        Long listingId,
        Long carrierId,
        String carrierName,
        String vehicleType,
        BigDecimal ratingAvg,
        BigDecimal priceEur,
        String message,
        String status,
        Instant createdAt
) {
    public static OfferResponse from(FreightOffer o) {
        var c = o.getCarrier();
        return new OfferResponse(
                o.getId(), o.getListing().getId(), c.getId(),
                c.getUser().getFullName(), c.getVehicleType().name(),
                c.getRatingAvg(), o.getPriceEur(), o.getMessage(),
                o.getStatus().name(), o.getCreatedAt()
        );
    }
}
