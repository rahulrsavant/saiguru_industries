package com.saiguru.backend.calculator.formula;

import java.util.Map;

/**
 * Calculates volume for I-beam sections with two flanges.
 */
public class BeamIFormula extends RoundBarFormula {
    @Override
    public FormulaResult compute(FormulaInput input) {
        Map<String, Double> dimensions = input.getDimensionsCm();
        double height = dimensions.get("height");
        double flangeWidth = dimensions.get("flange_width");
        double webThickness = dimensions.get("web_thickness");
        double flangeThickness = dimensions.get("flange_thickness");
        double length = dimensions.get("length");

        double webHeight = Math.max(height - 2.0 * flangeThickness, 0.0);
        double webArea = webHeight * webThickness;
        double flangeArea = 2.0 * flangeWidth * flangeThickness;
        double crossSectionAreaCm2 = flangeArea + webArea;
        double volumePerPieceCm3 = crossSectionAreaCm2 * length;
        return computeResult(volumePerPieceCm3, input);
    }
}
