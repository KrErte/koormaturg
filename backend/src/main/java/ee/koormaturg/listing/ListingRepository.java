package ee.koormaturg.listing;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

public interface ListingRepository extends JpaRepository<FreightListing, Long> {

    @Query("""
        SELECT l FROM FreightListing l
        WHERE l.status = 'OPEN'
        AND (:pickupCity IS NULL OR :pickupCity = '' OR l.pickupCity = :pickupCity)
        AND (:deliveryCity IS NULL OR :deliveryCity = '' OR l.deliveryCity = :deliveryCity)
        AND (:vehicleType IS NULL OR :vehicleType = '' OR l.vehicleTypeRequired = :vehicleType)
        AND (:dateFrom IS NULL OR l.pickupDate >= :dateFrom)
        AND (:dateTo IS NULL OR l.pickupDate <= :dateTo)
        ORDER BY l.createdAt DESC
    """)
    Page<FreightListing> search(
            @Param("pickupCity") String pickupCity,
            @Param("deliveryCity") String deliveryCity,
            @Param("vehicleType") String vehicleType,
            @Param("dateFrom") LocalDate dateFrom,
            @Param("dateTo") LocalDate dateTo,
            Pageable pageable);

    List<FreightListing> findByPostedByIdOrderByCreatedAtDesc(Long userId);

    List<FreightListing> findByStatusAndPaymentDeadlineBefore(
            FreightListing.ListingStatus status, Instant deadline);
}
