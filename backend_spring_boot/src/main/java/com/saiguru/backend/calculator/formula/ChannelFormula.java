package com.saiguru.backend.calculator.formula;

import java.util.Map;

/**
 * Shared implementation for C and U channel sections.
 */
public class ChannelFormula extends RoundBarFormula {
    @Override
    public FormulaResult compute(FormulaInput input) {
        Map<String, Double> dimensions = input.getDimensionsCm();
        double height = dimensions.get("height");
        double flangeWidth = dimensions.get("flange_width");
        double webThickness = dimensions.get("web_thickness");
        double flangeThickness = dimensions.get("flange_thickness");
        double length = dimensions.get("length");

        double webArea = height * webThickness;
        double flangeArea = flangeWidth * flangeThickness;
        double overlapArea = webThickness * flangeThickness;
        double crossSectionAreaCm2 = webArea + 2.0 * flangeArea - 2.0 * overlapArea;
        double volumePerPieceCm3 = crossSectionAreaCm2 * length;
        return computeResult(volumePerPieceCm3, input);
    }
}
