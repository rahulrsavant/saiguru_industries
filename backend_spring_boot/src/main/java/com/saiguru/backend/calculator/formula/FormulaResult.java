package com.saiguru.backend.calculator.formula;

public class FormulaResult {
    private final double weightKg;
    private final double volumeM3;
    private final double quantity;
    private final double volumePerPieceM3;

    public FormulaResult(double weightKg, double volumeM3, double quantity, double volumePerPieceM3) {
        this.weightKg = weightKg;
        this.volumeM3 = volumeM3;
        this.quantity = quantity;
        this.volumePerPieceM3 = volumePerPieceM3;
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

    public double getVolumePerPieceM3() {
        return volumePerPieceM3;
    }
}
