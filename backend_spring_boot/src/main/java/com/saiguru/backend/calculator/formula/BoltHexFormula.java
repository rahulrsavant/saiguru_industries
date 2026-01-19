package com.saiguru.backend.calculator.formula;

public class BoltHexFormula extends RoundBarFormula {
    @Override
    public FormulaResult compute(FormulaInput input) {
        double diameter = input.getDimensionsMm().get("diameter");
        double length = input.getDimensionsMm().get("length");
        double radius = diameter / 2.0;
        double volumePerPieceMm3 = Math.PI * radius * radius * length;
        return computeResult(volumePerPieceMm3, input);
    }
}
