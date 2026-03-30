package ee.koormaturg.carrier;

import ee.koormaturg.user.User;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Entity
@Table(name = "carrier_profile")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class CarrierProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "company_name")
    private String companyName;

    @Column(name = "license_number", nullable = false)
    private String licenseNumber;

    @Column(name = "license_doc_path")
    private String licenseDocPath;

    @Column(name = "insurance_doc_path")
    private String insuranceDocPath;

    @Column(name = "vehicle_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private VehicleType vehicleType;

    @Column(name = "vehicle_plate", nullable = false)
    private String vehiclePlate;

    @Column(name = "max_load_kg", nullable = false)
    private Integer maxLoadKg;

    @Column(name = "operating_regions", columnDefinition = "text[]")
    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.ARRAY)
    private List<String> operatingRegions;

    private String bio;

    @Builder.Default
    private Boolean verified = false;

    @Column(name = "verified_at")
    private Instant verifiedAt;

    @Column(name = "rating_avg")
    private BigDecimal ratingAvg;

    @Column(name = "rating_count")
    @Builder.Default
    private Integer ratingCount = 0;

    @Column(name = "created_at")
    private Instant createdAt;

    @PrePersist
    void prePersist() {
        if (createdAt == null) createdAt = Instant.now();
    }

    public enum VehicleType { CURTAIN, REFRIGERATED, FLATBED, VAN, TANKER }
}
