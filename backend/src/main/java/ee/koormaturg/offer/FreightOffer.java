package ee.koormaturg.offer;

import ee.koormaturg.carrier.CarrierProfile;
import ee.koormaturg.listing.FreightListing;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "freight_offer")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class FreightOffer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "listing_id", nullable = false)
    private FreightListing listing;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "carrier_id", nullable = false)
    private CarrierProfile carrier;

    @Column(name = "price_eur", nullable = false)
    private BigDecimal priceEur;

    private String message;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private OfferStatus status = OfferStatus.PENDING;

    @Column(name = "created_at")
    private Instant createdAt;

    @PrePersist
    void prePersist() {
        if (createdAt == null) createdAt = Instant.now();
    }

    public enum OfferStatus { PENDING, ACCEPTED, REJECTED, EXPIRED }
}
