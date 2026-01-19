package com.saiguru.backend.calculator.formula;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.saiguru.backend.calculator.model.CalculationMode;

import java.util.Map;

import org.junit.jupiter.api.Test;

class FastenerFormulaTest {
    private static final double DENSITY = 2700.0;
    private static final double TOLERANCE = 1e-12;

    @Test
    void screwMachineQtyToWeightMatchesExpected() {
        Formula formula = new ScrewMachineFormula();
        Map<String, Double> dimensions = Map.of("diameter", 2.0, "length", 20.0);
        FormulaInput input = new FormulaInput(dimensions, DENSITY, 11.0, CalculationMode.QTY_TO_WEIGHT);

        FormulaResult result = formula.compute(input);

        double diameterM = 2.0 / 1000.0;
        double lengthM = 20.0 / 1000.0;
        double volumePerPiece = Math.PI * Math.pow(diameterM / 2.0, 2) * lengthM;
        double expectedVolume = volumePerPiece * 11.0;
        double expectedWeight = expectedVolume * DENSITY;

        assertEquals(expectedWeight, result.getWeightKg(), TOLERANCE);
        assertEquals(expectedVolume, result.getVolumeM3(), TOLERANCE);
    }

    @Test
    void screwMachineWeightToQtyMatchesExpected() {
        Formula formula = new ScrewMachineFormula();
        Map<String, Double> dimensions = Map.of("diameter", 2.0, "length", 20.0);
        double targetWeight = 0.02;
        FormulaInput input = new FormulaInput(dimensions, DENSITY, targetWeight, CalculationMode.WEIGHT_TO_QTY);

        FormulaResult result = formula.compute(input);

        double diameterM = 2.0 / 1000.0;
        double lengthM = 20.0 / 1000.0;
        double volumePerPiece = Math.PI * Math.pow(diameterM / 2.0, 2) * lengthM;
        double massPerPiece = volumePerPiece * DENSITY;
        double expectedQuantity = targetWeight / massPerPiece;
        double expectedVolume = volumePerPiece * expectedQuantity;

        assertEquals(targetWeight, result.getWeightKg(), TOLERANCE);
        assertEquals(expectedQuantity, result.getQuantity(), TOLERANCE);
        assertEquals(expectedVolume, result.getVolumeM3(), TOLERANCE);
    }

    @Test
    void nutHexQtyToWeightMatchesExpected() {
        Formula formula = new NutHexFormula();
        Map<String, Double> dimensions = Map.of("diameter", 10.0, "thickness", 5.0);
        FormulaInput input = new FormulaInput(dimensions, DENSITY, 8.0, CalculationMode.QTY_TO_WEIGHT);

        FormulaResult result = formula.compute(input);

        double innerDiameterM = 10.0 / 1000.0;
        double outerDiameterM = innerDiameterM * 1.6;
        double thicknessM = 5.0 / 1000.0;
        double volumePerPiece = Math.PI
            * (Math.pow(outerDiameterM / 2.0, 2) - Math.pow(innerDiameterM / 2.0, 2))
            * thicknessM;
        double expectedVolume = volumePerPiece * 8.0;
        double expectedWeight = expectedVolume * DENSITY;

        assertEquals(expectedWeight, result.getWeightKg(), TOLERANCE);
        assertEquals(expectedVolume, result.getVolumeM3(), TOLERANCE);
    }

    @Test
    void nutHexWeightToQtyMatchesExpected() {
        Formula formula = new NutHexFormula();
        Map<String, Double> dimensions = Map.of("diameter", 10.0, "thickness", 5.0);
        double targetWeight = 0.05;
        FormulaInput input = new FormulaInput(dimensions, DENSITY, targetWeight, CalculationMode.WEIGHT_TO_QTY);

        FormulaResult result = formula.compute(input);

        double innerDiameterM = 10.0 / 1000.0;
        double outerDiameterM = innerDiameterM * 1.6;
        double thicknessM = 5.0 / 1000.0;
        double volumePerPiece = Math.PI
            * (Math.pow(outerDiameterM / 2.0, 2) - Math.pow(innerDiameterM / 2.0, 2))
            * thicknessM;
        double massPerPiece = volumePerPiece * DENSITY;
        double expectedQuantity = targetWeight / massPerPiece;
        double expectedVolume = volumePerPiece * expectedQuantity;

        assertEquals(targetWeight, result.getWeightKg(), TOLERANCE);
        assertEquals(expectedQuantity, result.getQuantity(), TOLERANCE);
        assertEquals(expectedVolume, result.getVolumeM3(), TOLERANCE);
    }
}
