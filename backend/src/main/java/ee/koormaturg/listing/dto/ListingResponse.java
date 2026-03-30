package ee.koormaturg.listing.dto;

import ee.koormaturg.listing.FreightListing;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

public record ListingResponse(
        Long id,
        Long postedById,
        String posterName,
        String title,
        String description,
        String pickupAddress,
        String pickupCity,
        String pickupCountry,
        String deliveryAddress,
        String deliveryCity,
        String deliveryCountry,
        LocalDate pickupDate,
        LocalDate deliveryDate,
        Boolean flexibleDates,
        String cargoDescription,
        Integer cargoWeightKg,
        BigDecimal cargoVolumeM3,
        String vehicleTypeRequired,
        String specialRequirements,
        BigDecimal budgetEur,
        BigDecimal acceptedPriceEur,
        String status,
        Long acceptedCarrierId,
        Instant acceptedAt,
        Instant expiresAt,
        Instant createdAt
) {
    public static ListingResponse from(FreightListing l) {
        return new ListingResponse(
                l.getId(), l.getPostedBy().getId(), l.getPostedBy().getFullName(),
                l.getTitle(), l.getDescription(),
                l.getPickupAddress(), l.getPickupCity(), l.getPickupCountry(),
                l.getDeliveryAddress(), l.getDeliveryCity(), l.getDeliveryCountry(),
                l.getPickupDate(), l.getDeliveryDate(), l.getFlexibleDates(),
                l.getCargoDescription(), l.getCargoWeightKg(), l.getCargoVolumeM3(),
                l.getVehicleTypeRequired(), l.getSpecialRequirements(),
                l.getBudgetEur(), l.getAcceptedPriceEur(),
                l.getStatus().name(),
                l.getAcceptedCarrier() != null ? l.getAcceptedCarrier().getId() : null,
                l.getAcceptedAt(), l.getExpiresAt(), l.getCreatedAt()
        );
    }
}
