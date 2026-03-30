package ee.koormaturg.listing;

import ee.koormaturg.listing.dto.CreateListingRequest;
import ee.koormaturg.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ListingService {

    private final ListingRepository listingRepository;
    private final UserRepository userRepository;

    @Transactional
    public FreightListing create(Long userId, CreateListingRequest req) {
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Kasutajat ei leitud"));

        var listing = FreightListing.builder()
                .postedBy(user)
                .title(req.title())
                .description(req.description())
                .pickupAddress(req.pickupAddress())
                .pickupCity(req.pickupCity())
                .pickupCountry(req.pickupCountry() != null ? req.pickupCountry() : "EE")
                .deliveryAddress(req.deliveryAddress())
                .deliveryCity(req.deliveryCity())
                .deliveryCountry(req.deliveryCountry() != null ? req.deliveryCountry() : "EE")
                .pickupDate(req.pickupDate())
                .deliveryDate(req.deliveryDate())
                .flexibleDates(req.flexibleDates() != null ? req.flexibleDates() : false)
                .cargoDescription(req.cargoDescription())
                .cargoWeightKg(req.cargoWeightKg())
                .cargoVolumeM3(req.cargoVolumeM3())
                .vehicleTypeRequired(req.vehicleTypeRequired())
                .specialRequirements(req.specialRequirements())
                .budgetEur(req.budgetEur())
                .build();
        return listingRepository.save(listing);
    }

    public Page<FreightListing> search(String pickupCity, String deliveryCity,
                                        String vehicleType, LocalDate dateFrom, LocalDate dateTo,
                                        Pageable pageable) {
        return listingRepository.search(pickupCity, deliveryCity, vehicleType, dateFrom, dateTo, pageable);
    }

    public FreightListing getById(Long id) {
        return listingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Vedu ei leitud"));
    }

    public List<FreightListing> getByUserId(Long userId) {
        return listingRepository.findByPostedByIdOrderByCreatedAtDesc(userId);
    }

    @Transactional
    public FreightListing update(Long userId, Long listingId, CreateListingRequest req) {
        var listing = getById(listingId);
        if (!listing.getPostedBy().getId().equals(userId)) {
            throw new SecurityException("Pole sinu postitus");
        }
        if (listing.getStatus() != FreightListing.ListingStatus.OPEN) {
            throw new IllegalArgumentException("Saab muuta ainult avatud postitust");
        }

        listing.setTitle(req.title());
        listing.setDescription(req.description());
        listing.setPickupAddress(req.pickupAddress());
        listing.setPickupCity(req.pickupCity());
        listing.setDeliveryAddress(req.deliveryAddress());
        listing.setDeliveryCity(req.deliveryCity());
        listing.setPickupDate(req.pickupDate());
        listing.setDeliveryDate(req.deliveryDate());
        listing.setFlexibleDates(req.flexibleDates());
        listing.setCargoDescription(req.cargoDescription());
        listing.setCargoWeightKg(req.cargoWeightKg());
        listing.setCargoVolumeM3(req.cargoVolumeM3());
        listing.setVehicleTypeRequired(req.vehicleTypeRequired());
        listing.setSpecialRequirements(req.specialRequirements());
        listing.setBudgetEur(req.budgetEur());
        return listingRepository.save(listing);
    }

    @Transactional
    public FreightListing cancel(Long userId, Long listingId) {
        var listing = getById(listingId);
        if (!listing.getPostedBy().getId().equals(userId)) {
            throw new SecurityException("Pole sinu postitus");
        }
        listing.setStatus(FreightListing.ListingStatus.CANCELLED);
        return listingRepository.save(listing);
    }

    @Transactional
    public FreightListing complete(Long userId, Long listingId) {
        var listing = getById(listingId);
        if (!listing.getPostedBy().getId().equals(userId)) {
            throw new SecurityException("Pole sinu postitus");
        }
        if (listing.getStatus() != FreightListing.ListingStatus.MATCHED
                && listing.getStatus() != FreightListing.ListingStatus.IN_TRANSIT) {
            throw new IllegalArgumentException("Vedu ei saa lõpetatuks märkida");
        }
        listing.setStatus(FreightListing.ListingStatus.COMPLETED);
        return listingRepository.save(listing);
    }
}
