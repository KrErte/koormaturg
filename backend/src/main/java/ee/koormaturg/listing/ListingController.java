package ee.koormaturg.listing;

import ee.koormaturg.listing.dto.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/listings")
@RequiredArgsConstructor
public class ListingController {

    private final ListingService listingService;

    @PostMapping
    public ResponseEntity<ListingResponse> create(
            @AuthenticationPrincipal Long userId,
            @Valid @RequestBody CreateListingRequest req) {
        return ResponseEntity.ok(ListingResponse.from(listingService.create(userId, req)));
    }

    @GetMapping
    public ResponseEntity<Page<ListingResponse>> search(
            @RequestParam(required = false) String pickup_city,
            @RequestParam(required = false) String delivery_city,
            @RequestParam(required = false) String vehicle_type,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date_from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date_to,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        var result = listingService.search(pickup_city, delivery_city, vehicle_type,
                date_from, date_to, PageRequest.of(page, size));
        return ResponseEntity.ok(result.map(ListingResponse::from));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ListingResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ListingResponse.from(listingService.getById(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ListingResponse> update(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long id,
            @Valid @RequestBody CreateListingRequest req) {
        return ResponseEntity.ok(ListingResponse.from(listingService.update(userId, id, req)));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ListingResponse> cancel(
            @AuthenticationPrincipal Long userId, @PathVariable Long id) {
        return ResponseEntity.ok(ListingResponse.from(listingService.cancel(userId, id)));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<ListingResponse> complete(
            @AuthenticationPrincipal Long userId, @PathVariable Long id) {
        return ResponseEntity.ok(ListingResponse.from(listingService.complete(userId, id)));
    }

    @GetMapping("/my")
    public ResponseEntity<List<ListingResponse>> my(@AuthenticationPrincipal Long userId) {
        return ResponseEntity.ok(listingService.getByUserId(userId).stream()
                .map(ListingResponse::from).toList());
    }
}
