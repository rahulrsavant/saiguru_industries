package com.saiguru.backend.calculator.model;

public class CalculationResponse {
    private double weightLbs;
    private double volumeIn3;

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
}
