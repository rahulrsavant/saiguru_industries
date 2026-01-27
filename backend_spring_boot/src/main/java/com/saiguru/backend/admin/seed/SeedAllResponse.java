package com.saiguru.backend.admin.seed;

public class SeedAllResponse {
    private String batchId;
    private SeedProductResponse products;
    private SeedEstimateSummary estimate;
    private String message;

    public SeedAllResponse() {
    }

    public String getBatchId() {
        return batchId;
    }

    public void setBatchId(String batchId) {
        this.batchId = batchId;
    }

    public SeedProductResponse getProducts() {
        return products;
    }

    public void setProducts(SeedProductResponse products) {
        this.products = products;
    }

    public SeedEstimateSummary getEstimate() {
        return estimate;
    }

    public void setEstimate(SeedEstimateSummary estimate) {
        this.estimate = estimate;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
