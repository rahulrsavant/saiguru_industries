package com.saiguru.backend.calculator.model;

import java.util.Map;

public class CalculationResult {
    private double weightKg;
    private Double totalWeightKg;
    private double volumeM3;
    private double weightKgRaw;
    private double volumeM3Raw;
    private double quantity;
    private double quantityRaw;
    private Double unitWeightKg;
    private Double densityGPerCm3;
    private Double volumePerPieceM3;
    private Map<String, Double> normalizedDimensionsMm;
    private CalculationMode mode;
    private String metal;
    private String alloy;

    public CalculationResult() {
    }

    public double getWeightKg() {
        return weightKg;
    }

    public void setWeightKg(double weightKg) {
        this.weightKg = weightKg;
    }

    public Double getTotalWeightKg() {
        return totalWeightKg;
    }

    public void setTotalWeightKg(Double totalWeightKg) {
        this.totalWeightKg = totalWeightKg;
    }

    public double getVolumeM3() {
        return volumeM3;
    }

    public void setVolumeM3(double volumeM3) {
        this.volumeM3 = volumeM3;
    }

    public double getWeightKgRaw() {
        return weightKgRaw;
    }

    public void setWeightKgRaw(double weightKgRaw) {
        this.weightKgRaw = weightKgRaw;
    }

    public double getVolumeM3Raw() {
        return volumeM3Raw;
    }

    public void setVolumeM3Raw(double volumeM3Raw) {
        this.volumeM3Raw = volumeM3Raw;
    }

    public double getQuantity() {
        return quantity;
    }

    public void setQuantity(double quantity) {
        this.quantity = quantity;
    }

    public double getQuantityRaw() {
        return quantityRaw;
    }

    public void setQuantityRaw(double quantityRaw) {
        this.quantityRaw = quantityRaw;
    }

    public Double getUnitWeightKg() {
        return unitWeightKg;
    }

    public void setUnitWeightKg(Double unitWeightKg) {
        this.unitWeightKg = unitWeightKg;
    }

    public Double getDensityGPerCm3() {
        return densityGPerCm3;
    }

    public void setDensityGPerCm3(Double densityGPerCm3) {
        this.densityGPerCm3 = densityGPerCm3;
    }

    public Double getVolumePerPieceM3() {
        return volumePerPieceM3;
    }

    public void setVolumePerPieceM3(Double volumePerPieceM3) {
        this.volumePerPieceM3 = volumePerPieceM3;
    }

    public Map<String, Double> getNormalizedDimensionsMm() {
        return normalizedDimensionsMm;
    }

    public void setNormalizedDimensionsMm(Map<String, Double> normalizedDimensionsMm) {
        this.normalizedDimensionsMm = normalizedDimensionsMm;
    }

    public CalculationMode getMode() {
        return mode;
    }

    public void setMode(CalculationMode mode) {
        this.mode = mode;
    }

    public String getMetal() {
        return metal;
    }

    public void setMetal(String metal) {
        this.metal = metal;
    }

    public String getAlloy() {
        return alloy;
    }

    public void setAlloy(String alloy) {
        this.alloy = alloy;
    }
}
