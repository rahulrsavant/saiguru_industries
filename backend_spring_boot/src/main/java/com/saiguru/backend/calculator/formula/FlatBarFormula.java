package com.saiguru.backend.calculator.formula;

public class FlatBarFormula extends RoundBarFormula {
    @Override
    public FormulaResult compute(FormulaInput input) {
        double width = input.getDimensionsCm().get("width");
        double thickness = input.getDimensionsCm().get("thickness");
        double length = input.getDimensionsCm().get("length");
        double volumePerPieceCm3 = width * thickness * length;
        return computeResult(volumePerPieceCm3, input);
    }
}
