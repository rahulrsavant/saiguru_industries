package com.saiguru.backend.auth;

import java.util.regex.Pattern;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.saiguru.backend.auth.dto.ChangePasswordRequest;
import com.saiguru.backend.auth.dto.LoginRequest;
import com.saiguru.backend.auth.dto.LoginResponse;
import com.saiguru.backend.auth.dto.UserResponse;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private static final Pattern PASSWORD_POLICY = Pattern.compile("^(?=.*[A-Z])(?=.*\\d).{8,}$");

    private final UserAccountRepository userAccountRepository;
    private final UserAccountService userAccountService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(
        UserAccountRepository userAccountRepository,
        UserAccountService userAccountService,
        PasswordEncoder passwordEncoder,
        JwtService jwtService
    ) {
        this.userAccountRepository = userAccountRepository;
        this.userAccountService = userAccountService;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        String normalized = userAccountService.normalizeUsername(request.getUsername());
        UserAccount user = userAccountRepository.findByUsernameIgnoreCase(normalized).orElse(null);
        if (user == null || !user.isActive()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String token = jwtService.generateToken(user);
        UserResponse userResponse = new UserResponse(user.getId(), user.getUsername(), user.getRole(), user.isActive());
        return ResponseEntity.ok(new LoginResponse(token, userResponse));
    }

    @PostMapping("/change-password")
    public ResponseEntity<Void> changePassword(
        Authentication authentication,
        @Valid @RequestBody ChangePasswordRequest request
    ) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        if (!PASSWORD_POLICY.matcher(request.getNewPassword()).matches()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        UserAccount user = userAccountService.findByUsername(authentication.getName());
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPasswordHash())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        userAccountService.updatePassword(user, request.getNewPassword());
        return ResponseEntity.noContent().build();
    }
}
