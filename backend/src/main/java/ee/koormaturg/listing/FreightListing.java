package ee.koormaturg.listing;

import ee.koormaturg.carrier.CarrierProfile;
import ee.koormaturg.user.User;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "freight_listing")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class FreightListing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "posted_by", nullable = false)
    private User postedBy;

    @Column(nullable = false)
    private String title;

    private String description;

    @Column(name = "pickup_address", nullable = false)
    private String pickupAddress;

    @Column(name = "pickup_city", nullable = false)
    private String pickupCity;

    @Column(name = "pickup_country", length = 2)
    @Builder.Default
    private String pickupCountry = "EE";

    @Column(name = "delivery_address", nullable = false)
    private String deliveryAddress;

    @Column(name = "delivery_city", nullable = false)
    private String deliveryCity;

    @Column(name = "delivery_country", length = 2)
    @Builder.Default
    private String deliveryCountry = "EE";

    @Column(name = "pickup_date", nullable = false)
    private LocalDate pickupDate;

    @Column(name = "delivery_date")
    private LocalDate deliveryDate;

    @Column(name = "flexible_dates")
    @Builder.Default
    private Boolean flexibleDates = false;

    @Column(name = "cargo_description")
    private String cargoDescription;

    @Column(name = "cargo_weight_kg")
    private Integer cargoWeightKg;

    @Column(name = "cargo_volume_m3")
    private BigDecimal cargoVolumeM3;

    @Column(name = "vehicle_type_required")
    private String vehicleTypeRequired;

    @Column(name = "special_requirements")
    private String specialRequirements;

    @Column(name = "budget_eur")
    private BigDecimal budgetEur;

    @Column(name = "accepted_price_eur")
    private BigDecimal acceptedPriceEur;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ListingStatus status = ListingStatus.OPEN;

    @Column(name = "stripe_payment_intent_id")
    private String stripePaymentIntentId;

    @Column(name = "service_fee_paid")
    @Builder.Default
    private Boolean serviceFeePaid = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "accepted_carrier_id")
    private CarrierProfile acceptedCarrier;

    @Column(name = "accepted_at")
    private Instant acceptedAt;

    @Column(name = "payment_deadline")
    private Instant paymentDeadline;

    @Column(name = "expires_at")
    private Instant expiresAt;

    @Column(name = "created_at")
    private Instant createdAt;

    @PrePersist
    void prePersist() {
        if (createdAt == null) createdAt = Instant.now();
        if (expiresAt == null) expiresAt = Instant.now().plusSeconds(30L * 24 * 3600);
    }

    public enum ListingStatus { OPEN, MATCHED, IN_TRANSIT, COMPLETED, CANCELLED }
}
