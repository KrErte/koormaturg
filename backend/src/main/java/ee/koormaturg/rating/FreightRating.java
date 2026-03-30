package ee.koormaturg.rating;

import ee.koormaturg.carrier.CarrierProfile;
import ee.koormaturg.listing.FreightListing;
import ee.koormaturg.user.User;
import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "freight_rating")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class FreightRating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "listing_id", nullable = false)
    private FreightListing listing;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rated_by", nullable = false)
    private User ratedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "carrier_id", nullable = false)
    private CarrierProfile carrier;

    @Column(nullable = false)
    private Integer stars;

    private String comment;

    @Column(name = "created_at")
    private Instant createdAt;

    @PrePersist
    void prePersist() {
        if (createdAt == null) createdAt = Instant.now();
    }
}
