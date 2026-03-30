package ee.koormaturg.offer;

import ee.koormaturg.offer.dto.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class OfferController {

    private final OfferService offerService;

    @PostMapping("/api/listings/{listingId}/offers")
    public ResponseEntity<OfferResponse> create(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long listingId,
            @Valid @RequestBody CreateOfferRequest req) {
        return ResponseEntity.ok(OfferResponse.from(offerService.create(userId, listingId, req)));
    }

    @GetMapping("/api/listings/{listingId}/offers")
    public ResponseEntity<List<OfferResponse>> getByListing(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long listingId) {
        return ResponseEntity.ok(offerService.getByListing(userId, listingId).stream()
                .map(OfferResponse::from).toList());
    }

    @PutMapping("/api/listings/{listingId}/offers/{id}/accept")
    public ResponseEntity<OfferResponse> accept(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long listingId, @PathVariable Long id) {
        return ResponseEntity.ok(OfferResponse.from(offerService.accept(userId, listingId, id)));
    }

    @PutMapping("/api/listings/{listingId}/offers/{id}/reject")
    public ResponseEntity<OfferResponse> reject(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long listingId, @PathVariable Long id) {
        return ResponseEntity.ok(OfferResponse.from(offerService.reject(userId, listingId, id)));
    }

    @GetMapping("/api/carriers/me/offers")
    public ResponseEntity<List<OfferResponse>> myOffers(@AuthenticationPrincipal Long userId) {
        return ResponseEntity.ok(offerService.getByCarrier(userId).stream()
                .map(OfferResponse::from).toList());
    }
}
