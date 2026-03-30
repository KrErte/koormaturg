package ee.koormaturg.offer;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OfferRepository extends JpaRepository<FreightOffer, Long> {
    List<FreightOffer> findByListingIdOrderByCreatedAtDesc(Long listingId);
    List<FreightOffer> findByCarrierIdOrderByCreatedAtDesc(Long carrierId);
    boolean existsByListingIdAndCarrierId(Long listingId, Long carrierId);
}
