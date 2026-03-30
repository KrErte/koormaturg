package ee.koormaturg.rating.dto;

import jakarta.validation.constraints.*;

public record CreateRatingRequest(
        @NotNull @Min(1) @Max(5) Integer stars,
        String comment
) {}
