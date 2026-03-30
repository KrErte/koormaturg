package ee.koormaturg.auth;

import ee.koormaturg.auth.dto.*;
import ee.koormaturg.user.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    @Value("${jwt.refresh-token-expiry}")
    private long refreshTokenExpiry;

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.email())) {
            throw new IllegalArgumentException("Email juba kasutusel");
        }

        var user = User.builder()
                .email(req.email())
                .passwordHash(passwordEncoder.encode(req.password()))
                .fullName(req.fullName())
                .phone(req.phone())
                .role(User.Role.USER)
                .build();
        user = userRepository.save(user);

        return buildAuthResponse(user);
    }

    @Transactional
    public AuthResponse login(LoginRequest req) {
        var user = userRepository.findByEmail(req.email())
                .orElseThrow(() -> new IllegalArgumentException("Vale email või parool"));

        if (!passwordEncoder.matches(req.password(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Vale email või parool");
        }

        return buildAuthResponse(user);
    }

    @Transactional
    public AuthResponse refresh(RefreshRequest req) {
        var rt = refreshTokenRepository.findByToken(req.refreshToken())
                .orElseThrow(() -> new IllegalArgumentException("Kehtetu refresh token"));

        if (rt.getExpiresAt().isBefore(Instant.now())) {
            refreshTokenRepository.delete(rt);
            throw new IllegalArgumentException("Refresh token aegunud");
        }

        refreshTokenRepository.delete(rt);
        return buildAuthResponse(rt.getUser());
    }

    @Transactional
    public void logout(String refreshToken) {
        refreshTokenRepository.deleteByToken(refreshToken);
    }

    private AuthResponse buildAuthResponse(User user) {
        String accessToken = jwtService.generateAccessToken(user);

        var rt = RefreshToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiresAt(Instant.now().plusSeconds(refreshTokenExpiry))
                .build();
        refreshTokenRepository.save(rt);

        return new AuthResponse(accessToken, rt.getToken());
    }
}
