package ee.koormaturg.auth.dto;

import ee.koormaturg.user.User;
import java.time.Instant;

public record UserResponse(
        Long id,
        String email,
        String fullName,
        String phone,
        String role,
        Instant createdAt
) {
    public static UserResponse from(User u) {
        return new UserResponse(u.getId(), u.getEmail(), u.getFullName(),
                u.getPhone(), u.getRole().name(), u.getCreatedAt());
    }
}
