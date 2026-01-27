package com.saiguru.backend.admin.seed;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Lob;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(
    name = "seeded_products",
    indexes = {
        @Index(name = "idx_seeded_products_lookup", columnList = "is_seeded,product_type,display_name"),
        @Index(name = "idx_seeded_products_batch", columnList = "seed_batch_id")
    }
)
public class SeededProduct {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_type", nullable = false)
    private String productType;

    @Column(name = "display_name", nullable = false)
    private String displayName;

    @Column(name = "calculator_id", nullable = false)
    private String calculatorId;

    @Column(name = "metal_id", nullable = false)
    private String metalId;

    @Column(name = "alloy_id", nullable = false)
    private String alloyId;

    @Lob
    @Column(name = "dimensions_json", nullable = false)
    private String dimensionsJson;

    @Column(name = "price_per_kg")
    private BigDecimal pricePerKg;

    @Column(name = "created_by", nullable = false)
    private String createdBy;

    @Column(name = "is_seeded", nullable = false)
    private boolean seeded;

    @Column(name = "seed_batch_id", nullable = false)
    private String seedBatchId;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @PrePersist
    void onCreate() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }

    public Long getId() {
        return id;
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

    public String getCalculatorId() {
        return calculatorId;
    }

    public void setCalculatorId(String calculatorId) {
        this.calculatorId = calculatorId;
    }

    public String getMetalId() {
        return metalId;
    }

    public void setMetalId(String metalId) {
        this.metalId = metalId;
    }

    public String getAlloyId() {
        return alloyId;
    }

    public void setAlloyId(String alloyId) {
        this.alloyId = alloyId;
    }

    public String getDimensionsJson() {
        return dimensionsJson;
    }

    public void setDimensionsJson(String dimensionsJson) {
        this.dimensionsJson = dimensionsJson;
    }

    public BigDecimal getPricePerKg() {
        return pricePerKg;
    }

    public void setPricePerKg(BigDecimal pricePerKg) {
        this.pricePerKg = pricePerKg;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public boolean isSeeded() {
        return seeded;
    }

    public void setSeeded(boolean seeded) {
        this.seeded = seeded;
    }

    public String getSeedBatchId() {
        return seedBatchId;
    }

    public void setSeedBatchId(String seedBatchId) {
        this.seedBatchId = seedBatchId;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
