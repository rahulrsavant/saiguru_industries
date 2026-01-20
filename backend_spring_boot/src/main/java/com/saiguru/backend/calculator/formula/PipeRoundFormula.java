package com.saiguru.backend.calculator.formula;

public class PipeRoundFormula extends RoundBarFormula {
    @Override
    public FormulaResult compute(FormulaInput input) {
        double outsideDiameter = input.getDimensionsCm().get("outside_diameter");
        double wallThickness = input.getDimensionsCm().get("wall_thickness");
        double length = input.getDimensionsCm().get("length");

        double outerRadius = outsideDiameter / 2.0;
        double innerRadius = outerRadius - wallThickness;
        double volumePerPieceCm3 = Math.PI * (outerRadius * outerRadius - innerRadius * innerRadius) * length;
        return computeResult(volumePerPieceCm3, input);
    }
}
