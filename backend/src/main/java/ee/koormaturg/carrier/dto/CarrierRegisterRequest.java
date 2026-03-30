package ee.koormaturg.carrier.dto;

import ee.koormaturg.carrier.CarrierProfile.VehicleType;
import jakarta.validation.constraints.*;
import java.util.List;

public record CarrierRegisterRequest(
        String companyName,
        @NotBlank String licenseNumber,
        @NotNull VehicleType vehicleType,
        @NotBlank String vehiclePlate,
        @NotNull @Min(1) Integer maxLoadKg,
        List<String> operatingRegions,
        String bio
) {}
