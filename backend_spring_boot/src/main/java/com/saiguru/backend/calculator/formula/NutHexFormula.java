package com.saiguru.backend.calculator.formula;

public class NutHexFormula extends RoundBarFormula {
    private static final double OUTER_DIAMETER_FACTOR = 1.6;

    @Override
    public FormulaResult compute(FormulaInput input) {
        double innerDiameter = input.getDimensionsMm().get("diameter");
        double thickness = input.getDimensionsMm().get("thickness");
        double outerDiameter = innerDiameter * OUTER_DIAMETER_FACTOR;
        double innerRadius = innerDiameter / 2.0;
        double outerRadius = outerDiameter / 2.0;
        double volumePerPieceMm3 = Math.PI * (outerRadius * outerRadius - innerRadius * innerRadius) * thickness;
        return computeResult(volumePerPieceMm3, input);
    }
}
