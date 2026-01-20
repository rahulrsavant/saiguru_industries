package com.saiguru.backend.calculator.formula;

public class SheetFormula extends RoundBarFormula {
    @Override
    public FormulaResult compute(FormulaInput input) {
        double thickness = input.getDimensionsCm().get("thickness");
        double width = input.getDimensionsCm().get("width");
        double length = input.getDimensionsCm().get("length");
        double volumePerPieceCm3 = thickness * width * length;
        return computeResult(volumePerPieceCm3, input);
    }
}
