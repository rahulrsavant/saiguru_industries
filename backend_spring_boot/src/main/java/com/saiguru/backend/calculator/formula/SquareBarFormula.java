package com.saiguru.backend.calculator.formula;

public class SquareBarFormula extends RoundBarFormula {
    @Override
    public FormulaResult compute(FormulaInput input) {
        double width = input.getDimensionsMm().get("width");
        double length = input.getDimensionsMm().get("length");
        double volumePerPieceMm3 = width * width * length;
        return computeResult(volumePerPieceMm3, input);
    }
}
