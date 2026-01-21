package com.saiguru.backend.auth;

import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.saiguru.backend.auth.dto.CreateUserRequest;
import com.saiguru.backend.auth.dto.ResetPasswordRequest;
import com.saiguru.backend.auth.dto.UpdateStatusRequest;
import com.saiguru.backend.auth.dto.UserResponse;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {
    private static final Pattern PASSWORD_POLICY = Pattern.compile("^(?=.*[A-Z])(?=.*\\d).{8,}$");
    private final UserAccountRepository userAccountRepository;
    private final UserAccountService userAccountService;

    public AdminUserController(UserAccountRepository userAccountRepository, UserAccountService userAccountService) {
        this.userAccountRepository = userAccountRepository;
        this.userAccountService = userAccountService;
    }

    @PostMapping
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody CreateUserRequest request) {
        if (!PASSWORD_POLICY.matcher(request.getPassword()).matches()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        UserAccount user = userAccountService.createUser(request.getUsername(), request.getPassword(), request.getRole());
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(new UserResponse(user.getId(), user.getUsername(), user.getRole(), user.isActive()));
    }

    @GetMapping
    public List<UserResponse> listUsers() {
        return userAccountService.listUsers().stream()
            .map(user -> new UserResponse(user.getId(), user.getUsername(), user.getRole(), user.isActive()))
            .collect(Collectors.toList());
    }

    @PutMapping("/{id}/reset-password")
    public ResponseEntity<Void> resetPassword(@PathVariable Long id, @Valid @RequestBody ResetPasswordRequest request) {
        if (!PASSWORD_POLICY.matcher(request.getNewPassword()).matches()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        UserAccount user = userAccountRepository.findById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        userAccountService.updatePassword(user, request.getNewPassword());
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<UserResponse> updateStatus(@PathVariable Long id, @RequestBody UpdateStatusRequest request) {
        try {
            UserAccount user = userAccountService.updateStatus(id, request.isActive());
            return ResponseEntity.ok(new UserResponse(user.getId(), user.getUsername(), user.getRole(), user.isActive()));
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.notFound().build();
        }
    }
}
