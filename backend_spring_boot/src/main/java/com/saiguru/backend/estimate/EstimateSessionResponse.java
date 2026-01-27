package com.saiguru.backend.estimate;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class EstimateSessionResponse {
    private Long estimateId;
    private String estimateNo;
    private EstimateCustomer customer;
    private List<EstimateItemResponse> items = new ArrayList<>();
    private EstimateTotals totals;
    private Instant createdAt;
    private Instant updatedAt;

    public EstimateSessionResponse() {
    }

    public Long getEstimateId() {
        return estimateId;
    }

    public void setEstimateId(Long estimateId) {
        this.estimateId = estimateId;
    }

    public String getEstimateNo() {
        return estimateNo;
    }

    public void setEstimateNo(String estimateNo) {
        this.estimateNo = estimateNo;
    }

    public EstimateCustomer getCustomer() {
        return customer;
    }

    public void setCustomer(EstimateCustomer customer) {
        this.customer = customer;
    }

    public List<EstimateItemResponse> getItems() {
        return items;
    }

    public void setItems(List<EstimateItemResponse> items) {
        this.items = items;
    }

    public EstimateTotals getTotals() {
        return totals;
    }

    public void setTotals(EstimateTotals totals) {
        this.totals = totals;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public static class EstimateCustomer {
        private String name;
        private String businessName;
        private String mobile;
        private String email;

        public EstimateCustomer() {
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getBusinessName() {
            return businessName;
        }

        public void setBusinessName(String businessName) {
            this.businessName = businessName;
        }

        public String getMobile() {
            return mobile;
        }

        public void setMobile(String mobile) {
            this.mobile = mobile;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }
    }

    public static class EstimateTotals {
        private double totalWeightKg;

        public EstimateTotals() {
        }

        public double getTotalWeightKg() {
            return totalWeightKg;
        }

        public void setTotalWeightKg(double totalWeightKg) {
            this.totalWeightKg = totalWeightKg;
        }
    }

    public static class IdLabel {
        private String id;
        private String label;

        public IdLabel() {
        }

        public IdLabel(String id, String label) {
            this.id = id;
            this.label = label;
        }

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getLabel() {
            return label;
        }

        public void setLabel(String label) {
            this.label = label;
        }
    }

    public static class EstimateCalculation {
        private Double weightKg;

        public EstimateCalculation() {
        }

        public EstimateCalculation(Double weightKg) {
            this.weightKg = weightKg;
        }

        public Double getWeightKg() {
            return weightKg;
        }

        public void setWeightKg(Double weightKg) {
            this.weightKg = weightKg;
        }
    }

    public static class DimensionValue {
        private Double value;
        private String unit;

        public DimensionValue() {
        }

        public DimensionValue(Double value, String unit) {
            this.value = value;
            this.unit = unit;
        }

        public Double getValue() {
            return value;
        }

        public void setValue(Double value) {
            this.value = value;
        }

        public String getUnit() {
            return unit;
        }

        public void setUnit(String unit) {
            this.unit = unit;
        }
    }

    public static class EstimateItemResponse {
        private String lineId;
        private String estimateNo;
        private IdLabel metal;
        private IdLabel alloy;
        private IdLabel shape;
        private Integer pieces;
        private String mode;
        private String unitSystem;
        private Map<String, DimensionValue> dimensions;
        private EstimateCalculation calculation;
        private Instant createdAt;

        public EstimateItemResponse() {
        }

        public String getLineId() {
            return lineId;
        }

        public void setLineId(String lineId) {
            this.lineId = lineId;
        }

        public String getEstimateNo() {
            return estimateNo;
        }

        public void setEstimateNo(String estimateNo) {
            this.estimateNo = estimateNo;
        }

        public IdLabel getMetal() {
            return metal;
        }

        public void setMetal(IdLabel metal) {
            this.metal = metal;
        }

        public IdLabel getAlloy() {
            return alloy;
        }

        public void setAlloy(IdLabel alloy) {
            this.alloy = alloy;
        }

        public IdLabel getShape() {
            return shape;
        }

        public void setShape(IdLabel shape) {
            this.shape = shape;
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

        public Map<String, DimensionValue> getDimensions() {
            return dimensions;
        }

        public void setDimensions(Map<String, DimensionValue> dimensions) {
            this.dimensions = dimensions;
        }

        public EstimateCalculation getCalculation() {
            return calculation;
        }

        public void setCalculation(EstimateCalculation calculation) {
            this.calculation = calculation;
        }

        public Instant getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(Instant createdAt) {
            this.createdAt = createdAt;
        }
    }
}
