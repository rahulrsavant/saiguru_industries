package com.saiguru.backend.calculator.model;

public class CalculationResponse {
    private double weightLbs;
    private double volumeIn3;
    private double weightLbsRaw;
    private double volumeIn3Raw;
    private Double densityUsedLbPerIn3;
    private Integer pieces;
    private java.util.Map<String, Double> normalizedDimensionsInInches;

    public CalculationResponse() {
    }

    public CalculationResponse(double weightLbs, double volumeIn3) {
        this.weightLbs = weightLbs;
        this.volumeIn3 = volumeIn3;
    }

    public double getWeightLbs() {
        return weightLbs;
    }

    public void setWeightLbs(double weightLbs) {
        this.weightLbs = weightLbs;
    }

    public double getVolumeIn3() {
        return volumeIn3;
    }

    public void setVolumeIn3(double volumeIn3) {
        this.volumeIn3 = volumeIn3;
    }

    public double getWeightLbsRaw() {
        return weightLbsRaw;
    }

    public void setWeightLbsRaw(double weightLbsRaw) {
        this.weightLbsRaw = weightLbsRaw;
    }

    public double getVolumeIn3Raw() {
        return volumeIn3Raw;
    }

    public void setVolumeIn3Raw(double volumeIn3Raw) {
        this.volumeIn3Raw = volumeIn3Raw;
    }

    public Double getDensityUsedLbPerIn3() {
        return densityUsedLbPerIn3;
    }

    public void setDensityUsedLbPerIn3(Double densityUsedLbPerIn3) {
        this.densityUsedLbPerIn3 = densityUsedLbPerIn3;
    }

    public Integer getPieces() {
        return pieces;
    }

    public void setPieces(Integer pieces) {
        this.pieces = pieces;
    }

    public java.util.Map<String, Double> getNormalizedDimensionsInInches() {
        return normalizedDimensionsInInches;
    }

    public void setNormalizedDimensionsInInches(java.util.Map<String, Double> normalizedDimensionsInInches) {
        this.normalizedDimensionsInInches = normalizedDimensionsInInches;
    }
}
