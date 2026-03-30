package ee.koormaturg.rating;

import ee.koormaturg.rating.dto.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    @PostMapping("/api/ratings/listings/{listingId}")
    public ResponseEntity<RatingResponse> create(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long listingId,
            @Valid @RequestBody CreateRatingRequest req) {
        return ResponseEntity.ok(RatingResponse.from(ratingService.create(userId, listingId, req)));
    }

    @GetMapping("/api/carriers/{id}/ratings")
    public ResponseEntity<List<RatingResponse>> getByCarrier(@PathVariable Long id) {
        return ResponseEntity.ok(ratingService.getByCarrier(id).stream()
                .map(RatingResponse::from).toList());
    }
}
