package com.saiguru.backend.admin.seed;

public class SeedProductResult {
    private String type;
    private String name;
    private String id;
    private Double weightKg;
    private String status;
    private String notes;

    public SeedProductResult() {
    }

    public SeedProductResult(String type, String name, String id, Double weightKg, String status, String notes) {
        this.type = type;
        this.name = name;
        this.id = id;
        this.weightKg = weightKg;
        this.status = status;
        this.notes = notes;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
