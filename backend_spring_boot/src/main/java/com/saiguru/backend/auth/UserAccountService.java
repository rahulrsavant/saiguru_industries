package com.saiguru.backend.auth;

import java.util.List;
import java.util.Locale;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserAccountService {
    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;

    public UserAccountService(UserAccountRepository userAccountRepository, PasswordEncoder passwordEncoder) {
        this.userAccountRepository = userAccountRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserAccount createUser(String username, String rawPassword, UserRole role) {
        String normalized = normalizeUsername(username);
        if (userAccountRepository.existsByUsernameIgnoreCase(normalized)) {
            throw new IllegalArgumentException("Username already exists.");
        }
        UserAccount user = new UserAccount();
        user.setUsername(normalized);
        user.setPasswordHash(passwordEncoder.encode(rawPassword));
        user.setRole(role == null ? UserRole.USER : role);
        user.setActive(true);
        return userAccountRepository.save(user);
    }

    public UserAccount updatePassword(UserAccount user, String rawPassword) {
        user.setPasswordHash(passwordEncoder.encode(rawPassword));
        return userAccountRepository.save(user);
    }

    public UserAccount updateStatus(Long userId, boolean active) {
        UserAccount user = userAccountRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found."));
        user.setActive(active);
        return userAccountRepository.save(user);
    }

    public List<UserAccount> listUsers() {
        return userAccountRepository.findAll();
    }

    public UserAccount findByUsername(String username) {
        return userAccountRepository.findByUsernameIgnoreCase(normalizeUsername(username))
            .orElseThrow(() -> new IllegalArgumentException("User not found."));
    }

    public String normalizeUsername(String username) {
        if (username == null) return "";
        return username.trim().toLowerCase(Locale.ROOT);
    }
}
