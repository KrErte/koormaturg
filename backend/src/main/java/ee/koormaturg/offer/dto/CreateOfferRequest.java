package ee.koormaturg.offer.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record CreateOfferRequest(
        @NotNull @DecimalMin("0.01") BigDecimal priceEur,
        String message
) {}
