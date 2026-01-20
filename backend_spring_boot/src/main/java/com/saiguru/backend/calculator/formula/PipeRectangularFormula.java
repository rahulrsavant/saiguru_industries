package com.saiguru.backend.calculator.formula;

public class PipeRectangularFormula extends RoundBarFormula {
    @Override
    public FormulaResult compute(FormulaInput input) {
        double outsideWidth = input.getDimensionsCm().get("outside_width");
        double outsideHeight = input.getDimensionsCm().get("outside_height");
        double wallThickness = input.getDimensionsCm().get("wall_thickness");
        double length = input.getDimensionsCm().get("length");
        double innerWidth = outsideWidth - 2.0 * wallThickness;
        double innerHeight = outsideHeight - 2.0 * wallThickness;
        double volumePerPieceCm3 = (outsideWidth * outsideHeight - innerWidth * innerHeight) * length;
        return computeResult(volumePerPieceCm3, input);
    }
}
