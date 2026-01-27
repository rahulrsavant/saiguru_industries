package com.saiguru.backend.admin.seed;

public class SeedProductRequest {
    private String mode;
    private String batchId;

    public SeedProductRequest() {
    }

    public String getMode() {
        return mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }

    public String getBatchId() {
        return batchId;
    }

    public void setBatchId(String batchId) {
        this.batchId = batchId;
    }
}
