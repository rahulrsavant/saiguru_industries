package com.saiguru.backend.admin.seed;

import com.fasterxml.jackson.annotation.JsonProperty;

public class SeedProductResult {
    private String productType;
    private String displayName;
    private String id;
    private Double weightKg;
    private String status;
    private String error;

    public SeedProductResult() {
    }

    public SeedProductResult(String productType, String displayName, String id, Double weightKg, String status, String error) {
        this.productType = productType;
        this.displayName = displayName;
        this.id = id;
        this.weightKg = weightKg;
        this.status = status;
        this.error = error;
    }

    public String getProductType() {
        return productType;
    }

    public void setProductType(String productType) {
        this.productType = productType;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Double getWeightKg() {
        return weightKg;
    }

    public void setWeightKg(Double weightKg) {
        this.weightKg = weightKg;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    @JsonProperty("type")
    public String getType() {
        return productType;
    }

    @JsonProperty("type")
    public void setType(String type) {
        this.productType = type;
    }

    @JsonProperty("name")
    public String getName() {
        return displayName;
    }

    @JsonProperty("name")
    public void setName(String name) {
        this.displayName = name;
    }

    @JsonProperty("notes")
    public String getNotes() {
        return error;
    }

    @JsonProperty("notes")
    public void setNotes(String notes) {
        this.error = notes;
    }
}
