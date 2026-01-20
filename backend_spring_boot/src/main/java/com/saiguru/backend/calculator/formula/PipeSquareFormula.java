package com.saiguru.backend.calculator.formula;

public class PipeSquareFormula extends RoundBarFormula {
    @Override
    public FormulaResult compute(FormulaInput input) {
        double outsideWidth = input.getDimensionsCm().get("outside_width");
        double wallThickness = input.getDimensionsCm().get("wall_thickness");
        double length = input.getDimensionsCm().get("length");
        double innerWidth = outsideWidth - 2.0 * wallThickness;
        double volumePerPieceCm3 = (outsideWidth * outsideWidth - innerWidth * innerWidth) * length;
        return computeResult(volumePerPieceCm3, input);
    }
}
