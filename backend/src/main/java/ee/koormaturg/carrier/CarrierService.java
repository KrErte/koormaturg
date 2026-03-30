package ee.koormaturg.carrier;

import ee.koormaturg.carrier.dto.CarrierRegisterRequest;
import ee.koormaturg.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;

@Service
@RequiredArgsConstructor
public class CarrierService {

    private final CarrierRepository carrierRepository;
    private final UserRepository userRepository;

    @Value("${app.upload-dir}")
    private String uploadDir;

    @Transactional
    public CarrierProfile register(Long userId, CarrierRegisterRequest req) {
        if (carrierRepository.existsByUserId(userId)) {
            throw new IllegalArgumentException("Vedaja profiil juba olemas");
        }
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Kasutajat ei leitud"));

        var carrier = CarrierProfile.builder()
                .user(user)
                .companyName(req.companyName())
                .licenseNumber(req.licenseNumber())
                .vehicleType(req.vehicleType())
                .vehiclePlate(req.vehiclePlate())
                .maxLoadKg(req.maxLoadKg())
                .operatingRegions(req.operatingRegions())
                .bio(req.bio())
                .build();
        return carrierRepository.save(carrier);
    }

    @Transactional
    public CarrierProfile update(Long userId, CarrierRegisterRequest req) {
        var carrier = getByUserId(userId);
        carrier.setCompanyName(req.companyName());
        carrier.setLicenseNumber(req.licenseNumber());
        carrier.setVehicleType(req.vehicleType());
        carrier.setVehiclePlate(req.vehiclePlate());
        carrier.setMaxLoadKg(req.maxLoadKg());
        carrier.setOperatingRegions(req.operatingRegions());
        carrier.setBio(req.bio());
        return carrierRepository.save(carrier);
    }

    public CarrierProfile getByUserId(Long userId) {
        return carrierRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Vedaja profiili ei leitud"));
    }

    public CarrierProfile getById(Long id) {
        return carrierRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Vedajat ei leitud"));
    }

    @Transactional
    public String uploadDocument(Long userId, MultipartFile file, String type) {
        var carrier = getByUserId(userId);
        String filename = "carrier_" + carrier.getId() + "_" + type + "_" + System.currentTimeMillis()
                + getExtension(file.getOriginalFilename());

        try {
            Path dir = Paths.get(uploadDir);
            Files.createDirectories(dir);
            Path target = dir.resolve(filename);
            file.transferTo(target);
        } catch (IOException e) {
            throw new RuntimeException("Faili üleslaadimine ebaõnnestus", e);
        }

        if ("license".equals(type)) {
            carrier.setLicenseDocPath(filename);
        } else {
            carrier.setInsuranceDocPath(filename);
        }
        carrierRepository.save(carrier);
        return filename;
    }

    private String getExtension(String filename) {
        if (filename == null) return "";
        int dot = filename.lastIndexOf('.');
        return dot >= 0 ? filename.substring(dot) : "";
    }
}
