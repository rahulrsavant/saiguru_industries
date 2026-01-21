package com.saiguru.backend.auth.dto;

public class UpdateStatusRequest {
    private boolean active;

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
