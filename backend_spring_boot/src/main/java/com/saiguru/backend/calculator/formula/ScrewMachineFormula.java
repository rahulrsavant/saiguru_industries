package com.saiguru.backend.calculator.formula;

public class ScrewMachineFormula extends RoundBarFormula {
    @Override
    public FormulaResult compute(FormulaInput input) {
        double diameter = input.getDimensionsCm().get("diameter");
        double length = input.getDimensionsCm().get("length");
        double radius = diameter / 2.0;
        double volumePerPieceCm3 = Math.PI * radius * radius * length;
        return computeResult(volumePerPieceCm3, input);
    }
}
