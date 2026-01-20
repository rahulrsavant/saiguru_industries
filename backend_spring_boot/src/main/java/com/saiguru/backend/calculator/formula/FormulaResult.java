package com.saiguru.backend.calculator.formula;

public class FormulaResult {
    private final double weightKg;
    private final double volumeM3;
    private final double quantity;
    private final double volumePerPieceCm3;
    private final double unitWeightKg;

    public FormulaResult(double weightKg, double volumeM3, double quantity, double volumePerPieceCm3, double unitWeightKg) {
        this.weightKg = weightKg;
        this.volumeM3 = volumeM3;
        this.quantity = quantity;
        this.volumePerPieceCm3 = volumePerPieceCm3;
        this.unitWeightKg = unitWeightKg;
    }

    public double getWeightKg() {
        return weightKg;
    }

    public double getVolumeM3() {
        return volumeM3;
    }

    public double getQuantity() {
        return quantity;
    }

    public double getVolumePerPieceCm3() {
        return volumePerPieceCm3;
    }

    public double getUnitWeightKg() {
        return unitWeightKg;
    }
}
