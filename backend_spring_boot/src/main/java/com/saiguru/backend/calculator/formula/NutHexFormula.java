package com.saiguru.backend.calculator.formula;

public class NutHexFormula extends RoundBarFormula {
    private static final double OUTER_DIAMETER_FACTOR = 1.6;

    @Override
    public FormulaResult compute(FormulaInput input) {
        double innerDiameter = input.getDimensionsCm().get("diameter");
        double thickness = input.getDimensionsCm().get("thickness");
        double outerDiameter = innerDiameter * OUTER_DIAMETER_FACTOR;
        double innerRadius = innerDiameter / 2.0;
        double outerRadius = outerDiameter / 2.0;
        double volumePerPieceCm3 = Math.PI * (outerRadius * outerRadius - innerRadius * innerRadius) * thickness;
        return computeResult(volumePerPieceCm3, input);
    }
}
