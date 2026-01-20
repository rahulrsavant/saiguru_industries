package com.saiguru.backend.calculator.formula;

import com.saiguru.backend.calculator.model.CalculationMode;

public class RoundBarFormula implements Formula {
    @Override
    public FormulaResult compute(FormulaInput input) {
        double diameter = input.getDimensionsCm().get("diameter");
        double length = input.getDimensionsCm().get("length");
        double radius = diameter / 2.0;
        double volumePerPieceCm3 = Math.PI * radius * radius * length;
        return computeResult(volumePerPieceCm3, input);
    }

    protected FormulaResult computeResult(double volumePerPieceCm3, FormulaInput input) {
        double density = input.getDensityGPerCm3();
        double unitWeightKg = (volumePerPieceCm3 * density) / 1000.0;

        if (input.getMode() == CalculationMode.WEIGHT_TO_QTY) {
            double weightKg = input.getQuantityOrWeight();
            double quantity = weightKg / unitWeightKg;
            double volumeM3 = (volumePerPieceCm3 * quantity) / 1_000_000.0;
            return new FormulaResult(weightKg, volumeM3, quantity, volumePerPieceCm3, unitWeightKg);
        }

        double quantity = input.getQuantityOrWeight();
        double volumeM3 = (volumePerPieceCm3 * quantity) / 1_000_000.0;
        double weightKg = unitWeightKg * quantity;
        return new FormulaResult(weightKg, volumeM3, quantity, volumePerPieceCm3, unitWeightKg);
    }
}
