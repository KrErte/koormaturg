package ee.koormaturg.rating;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface RatingRepository extends JpaRepository<FreightRating, Long> {
    List<FreightRating> findByCarrierIdOrderByCreatedAtDesc(Long carrierId);
    boolean existsByListingIdAndRatedById(Long listingId, Long userId);

    @Query("SELECT AVG(r.stars) FROM FreightRating r WHERE r.carrier.id = :carrierId")
    Double averageByCarrierId(Long carrierId);

    long countByCarrierId(Long carrierId);
}
