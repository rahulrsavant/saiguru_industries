package com.saiguru.backend.calculator.formula;

import java.util.Map;

/**
 * Calculates volume for unequal-leg L sections using the two leg lengths.
 */
public class AngleUnequalFormula extends RoundBarFormula {
    @Override
    public FormulaResult compute(FormulaInput input) {
        Map<String, Double> dimensions = input.getDimensionsCm();
        double legA = dimensions.get("leg_a");
        double legB = dimensions.get("leg_b");
        double thickness = dimensions.get("thickness");
        double length = dimensions.get("length");

        double crossSectionAreaCm2 = thickness * (legA + legB - thickness);
        double volumePerPieceCm3 = crossSectionAreaCm2 * length;
        return computeResult(volumePerPieceCm3, input);
    }
}
