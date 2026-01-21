package com.saiguru.backend.auth.dto;

import com.saiguru.backend.auth.UserRole;

public class UserResponse {
    private Long id;
    private String username;
    private UserRole role;
    private boolean active;

    public UserResponse(Long id, String username, UserRole role, boolean active) {
        this.id = id;
        this.username = username;
        this.role = role;
        this.active = active;
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public UserRole getRole() {
        return role;
    }

    public boolean isActive() {
        return active;
    }
}
