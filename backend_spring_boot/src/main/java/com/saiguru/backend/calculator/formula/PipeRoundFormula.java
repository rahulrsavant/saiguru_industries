package com.saiguru.backend.calculator.formula;

public class PipeRoundFormula extends RoundBarFormula {
    @Override
    public FormulaResult compute(FormulaInput input) {
        double outsideDiameter = input.getDimensionsMm().get("outside_diameter");
        double wallThickness = input.getDimensionsMm().get("wall_thickness");
        double length = input.getDimensionsMm().get("length");

        double outerRadius = outsideDiameter / 2.0;
        double innerRadius = outerRadius - wallThickness;
        double volumePerPieceMm3 = Math.PI * (outerRadius * outerRadius - innerRadius * innerRadius) * length;
        return computeResult(volumePerPieceMm3, input);
    }
}
