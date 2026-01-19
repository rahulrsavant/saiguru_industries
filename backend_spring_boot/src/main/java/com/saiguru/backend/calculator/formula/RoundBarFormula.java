package com.saiguru.backend.calculator.formula;

import com.saiguru.backend.calculator.model.CalculationMode;

public class RoundBarFormula implements Formula {
    @Override
    public FormulaResult compute(FormulaInput input) {
        double diameter = input.getDimensionsMm().get("diameter");
        double length = input.getDimensionsMm().get("length");
        double radius = diameter / 2.0;
        double volumePerPieceMm3 = Math.PI * radius * radius * length;
        return computeResult(volumePerPieceMm3, input);
    }

    protected FormulaResult computeResult(double volumePerPieceMm3, FormulaInput input) {
        double volumePerPieceM3 = volumePerPieceMm3 / 1_000_000_000.0;
        double density = input.getDensityKgM3();

        if (input.getMode() == CalculationMode.WEIGHT_TO_QTY) {
            double weightKg = input.getQuantityOrWeight();
            double quantity = weightKg / (volumePerPieceM3 * density);
            double volumeM3 = volumePerPieceM3 * quantity;
            return new FormulaResult(weightKg, volumeM3, quantity, volumePerPieceM3);
        }

        double quantity = input.getQuantityOrWeight();
        double volumeM3 = volumePerPieceM3 * quantity;
        double weightKg = volumeM3 * density;
        return new FormulaResult(weightKg, volumeM3, quantity, volumePerPieceM3);
    }
}
