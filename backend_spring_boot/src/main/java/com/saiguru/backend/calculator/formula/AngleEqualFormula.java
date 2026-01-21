package com.saiguru.backend.calculator.formula;

import java.util.Map;

/**
 * Calculates volume for equal-leg L sections using leg length and thickness.
 */
public class AngleEqualFormula extends RoundBarFormula {
    @Override
    public FormulaResult compute(FormulaInput input) {
        Map<String, Double> dimensions = input.getDimensionsCm();
        double leg = dimensions.get("leg");
        double thickness = dimensions.get("thickness");
        double length = dimensions.get("length");

        double crossSectionAreaCm2 = thickness * (2.0 * leg - thickness);
        double volumePerPieceCm3 = crossSectionAreaCm2 * length;
        return computeResult(volumePerPieceCm3, input);
    }
}
