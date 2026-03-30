package ee.koormaturg.listing.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public record CreateListingRequest(
        @NotBlank String title,
        String description,
        @NotBlank String pickupAddress,
        @NotBlank String pickupCity,
        String pickupCountry,
        @NotBlank String deliveryAddress,
        @NotBlank String deliveryCity,
        String deliveryCountry,
        @NotNull LocalDate pickupDate,
        LocalDate deliveryDate,
        Boolean flexibleDates,
        String cargoDescription,
        Integer cargoWeightKg,
        BigDecimal cargoVolumeM3,
        String vehicleTypeRequired,
        String specialRequirements,
        BigDecimal budgetEur
) {}
