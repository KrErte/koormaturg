package ee.koormaturg.admin;

import ee.koormaturg.carrier.CarrierProfile;
import ee.koormaturg.carrier.CarrierRepository;
import ee.koormaturg.carrier.dto.CarrierResponse;
import ee.koormaturg.listing.ListingRepository;
import ee.koormaturg.listing.dto.ListingResponse;
import ee.koormaturg.notification.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final CarrierRepository carrierRepository;
    private final ListingRepository listingRepository;
    private final NotificationService notificationService;

    @GetMapping("/carriers")
    public ResponseEntity<List<CarrierResponse>> carriers(
            @RequestParam(required = false) Boolean verified) {
        var list = verified != null
                ? carrierRepository.findByVerified(verified)
                : carrierRepository.findAll();
        return ResponseEntity.ok(list.stream().map(CarrierResponse::from).toList());
    }

    @PutMapping("/carriers/{id}/verify")
    public ResponseEntity<CarrierResponse> verify(@PathVariable Long id) {
        var carrier = carrierRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Vedajat ei leitud"));
        carrier.setVerified(true);
        carrier.setVerifiedAt(Instant.now());
        carrierRepository.save(carrier);
        notificationService.sendCarrierVerified(carrier.getUser().getEmail(), carrier.getUser().getFullName());
        return ResponseEntity.ok(CarrierResponse.from(carrier));
    }

    @PutMapping("/carriers/{id}/reject")
    public ResponseEntity<CarrierResponse> reject(@PathVariable Long id, @RequestBody Map<String, String> body) {
        var carrier = carrierRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Vedajat ei leitud"));
        carrier.setVerified(false);
        carrierRepository.save(carrier);
        return ResponseEntity.ok(CarrierResponse.from(carrier));
    }

    @GetMapping("/listings")
    public ResponseEntity<List<ListingResponse>> listings() {
        return ResponseEntity.ok(listingRepository.findAll().stream()
                .map(ListingResponse::from).toList());
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> stats() {
        return ResponseEntity.ok(Map.of(
                "totalUsers", carrierRepository.count(),
                "totalListings", listingRepository.count(),
                "totalCarriers", carrierRepository.count(),
                "verifiedCarriers", carrierRepository.findByVerified(true).size()
        ));
    }
}
