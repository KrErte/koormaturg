package ee.koormaturg.carrier;

import ee.koormaturg.carrier.dto.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/carriers")
@RequiredArgsConstructor
public class CarrierController {

    private final CarrierService carrierService;

    @PostMapping("/register")
    public ResponseEntity<CarrierResponse> register(
            @AuthenticationPrincipal Long userId,
            @Valid @RequestBody CarrierRegisterRequest req) {
        return ResponseEntity.ok(CarrierResponse.from(carrierService.register(userId, req)));
    }

    @GetMapping("/me")
    public ResponseEntity<CarrierResponse> me(@AuthenticationPrincipal Long userId) {
        return ResponseEntity.ok(CarrierResponse.from(carrierService.getByUserId(userId)));
    }

    @PutMapping("/me")
    public ResponseEntity<CarrierResponse> update(
            @AuthenticationPrincipal Long userId,
            @Valid @RequestBody CarrierRegisterRequest req) {
        return ResponseEntity.ok(CarrierResponse.from(carrierService.update(userId, req)));
    }

    @PostMapping("/me/license")
    public ResponseEntity<String> uploadLicense(
            @AuthenticationPrincipal Long userId,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(carrierService.uploadDocument(userId, file, "license"));
    }

    @PostMapping("/me/insurance")
    public ResponseEntity<String> uploadInsurance(
            @AuthenticationPrincipal Long userId,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(carrierService.uploadDocument(userId, file, "insurance"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CarrierResponse> getPublic(@PathVariable Long id) {
        return ResponseEntity.ok(CarrierResponse.from(carrierService.getById(id)));
    }
}
