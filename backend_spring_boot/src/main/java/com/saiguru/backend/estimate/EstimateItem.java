package com.saiguru.backend.estimate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "estimate_items")
public class EstimateItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "estimate_id", nullable = false)
    private Estimate estimate;

    @Column(name = "product_type", nullable = false)
    private String productType;

    @Column(name = "display_name", nullable = false)
    private String displayName;

    @Column(name = "shape_calculator_id", nullable = false)
    private String shapeCalculatorId;

    @Column(name = "metal_id", nullable = false)
    private String metalId;

    @Column(name = "alloy_id", nullable = false)
    private String alloyId;

    @Column(name = "pieces", nullable = false)
    private Integer pieces;

    @Column(name = "mode", nullable = false)
    private String mode;

    @Column(name = "unit_system", nullable = false)
    private String unitSystem;

    @Lob
    @Column(name = "dimensions_json", nullable = false)
    private String dimensionsJson;

    @Column(name = "result_kg", nullable = false)
    private BigDecimal resultKg;

    @Column(name = "product_ref_id")
    private Long productRefId;

    @Column(name = "is_seeded_demo", nullable = false)
    private boolean seededDemo;

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

    public Estimate getEstimate() {
        return estimate;
    }

    public void setEstimate(Estimate estimate) {
        this.estimate = estimate;
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

    public String getShapeCalculatorId() {
        return shapeCalculatorId;
    }

    public void setShapeCalculatorId(String shapeCalculatorId) {
        this.shapeCalculatorId = shapeCalculatorId;
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

    public Integer getPieces() {
        return pieces;
    }

    public void setPieces(Integer pieces) {
        this.pieces = pieces;
    }

    public String getMode() {
        return mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }

    public String getUnitSystem() {
        return unitSystem;
    }

    public void setUnitSystem(String unitSystem) {
        this.unitSystem = unitSystem;
    }

    public String getDimensionsJson() {
        return dimensionsJson;
    }

    public void setDimensionsJson(String dimensionsJson) {
        this.dimensionsJson = dimensionsJson;
    }

    public BigDecimal getResultKg() {
        return resultKg;
    }

    public void setResultKg(BigDecimal resultKg) {
        this.resultKg = resultKg;
    }

    public Long getProductRefId() {
        return productRefId;
    }

    public void setProductRefId(Long productRefId) {
        this.productRefId = productRefId;
    }

    public boolean isSeededDemo() {
        return seededDemo;
    }

    public void setSeededDemo(boolean seededDemo) {
        this.seededDemo = seededDemo;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
