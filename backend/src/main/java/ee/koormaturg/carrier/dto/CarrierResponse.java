package ee.koormaturg.carrier.dto;

import ee.koormaturg.carrier.CarrierProfile;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record CarrierResponse(
        Long id,
        Long userId,
        String fullName,
        String companyName,
        String licenseNumber,
        String vehicleType,
        String vehiclePlate,
        Integer maxLoadKg,
        List<String> operatingRegions,
        String bio,
        Boolean verified,
        BigDecimal ratingAvg,
        Integer ratingCount,
        Instant createdAt
) {
    public static CarrierResponse from(CarrierProfile c) {
        return new CarrierResponse(
                c.getId(), c.getUser().getId(), c.getUser().getFullName(),
                c.getCompanyName(), c.getLicenseNumber(),
                c.getVehicleType().name(), c.getVehiclePlate(),
                c.getMaxLoadKg(), c.getOperatingRegions(), c.getBio(),
                c.getVerified(), c.getRatingAvg(), c.getRatingCount(),
                c.getCreatedAt()
        );
    }
}
