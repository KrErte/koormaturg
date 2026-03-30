package ee.koormaturg.carrier;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CarrierRepository extends JpaRepository<CarrierProfile, Long> {
    Optional<CarrierProfile> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
    List<CarrierProfile> findByVerified(boolean verified);
}
