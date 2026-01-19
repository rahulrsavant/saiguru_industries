package com.saiguru.backend.calculator.model;

import java.util.Map;

public class CalculationResult {
    private double weightKg;
    private double volumeM3;
    private double weightKgRaw;
    private double volumeM3Raw;
    private double quantity;
    private double quantityRaw;
    private Double densityKgM3;
    private Double volumePerPieceM3;
    private Map<String, Double> normalizedDimensionsMm;
    private CalculationMode mode;

    public CalculationResult() {
    }

    public double getWeightKg() {
        return weightKg;
    }

    public void setWeightKg(double weightKg) {
        this.weightKg = weightKg;
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

    public Double getDensityKgM3() {
        return densityKgM3;
    }

    public void setDensityKgM3(Double densityKgM3) {
        this.densityKgM3 = densityKgM3;
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
}
