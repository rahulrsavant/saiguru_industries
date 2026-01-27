package com.saiguru.backend.admin.seed;

import java.util.ArrayList;
import java.util.List;

public class SeedProductResponse {
    private String batchId;
    private int inserted;
    private int skipped;
    private int deleted;
    private List<SeedProductResult> items = new ArrayList<>();
    private List<String> errors = new ArrayList<>();

    public SeedProductResponse() {
    }

    public String getBatchId() {
        return batchId;
    }

    public void setBatchId(String batchId) {
        this.batchId = batchId;
    }

    public int getInserted() {
        return inserted;
    }

    public void setInserted(int inserted) {
        this.inserted = inserted;
    }

    public int getSkipped() {
        return skipped;
    }

    public void setSkipped(int skipped) {
        this.skipped = skipped;
    }

    public int getDeleted() {
        return deleted;
    }

    public void setDeleted(int deleted) {
        this.deleted = deleted;
    }

    public List<SeedProductResult> getItems() {
        return items;
    }

    public void setItems(List<SeedProductResult> items) {
        this.items = items;
    }

    public List<String> getErrors() {
        return errors;
    }

    public void setErrors(List<String> errors) {
        this.errors = errors;
    }
}
