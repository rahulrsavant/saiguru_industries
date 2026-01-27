package com.saiguru.backend.admin.seed;

import java.time.Instant;

public class SeedProductStatusResponse {
    private long totalSeededCount;
    private String lastBatchId;
    private Instant lastSeededAt;

    public SeedProductStatusResponse() {
    }

    public long getTotalSeededCount() {
        return totalSeededCount;
    }

    public void setTotalSeededCount(long totalSeededCount) {
        this.totalSeededCount = totalSeededCount;
    }

    public String getLastBatchId() {
        return lastBatchId;
    }

    public void setLastBatchId(String lastBatchId) {
        this.lastBatchId = lastBatchId;
    }

    public Instant getLastSeededAt() {
        return lastSeededAt;
    }

    public void setLastSeededAt(Instant lastSeededAt) {
        this.lastSeededAt = lastSeededAt;
    }
}
