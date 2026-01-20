package com.saiguru.backend.calculator.formula;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.saiguru.backend.calculator.model.CalculationMode;

import java.util.Map;

import org.junit.jupiter.api.Test;

class FastenerFormulaTest {
    private static final double DENSITY = 2.7;
    private static final double TOLERANCE = 1e-12;

    @Test
    void screwMachineQtyToWeightMatchesExpected() {
        Formula formula = new ScrewMachineFormula();
        Map<String, Double> dimensions = Map.of("diameter", 0.2, "length", 2.0);
        FormulaInput input = new FormulaInput(dimensions, DENSITY, 11.0, CalculationMode.QTY_TO_WEIGHT);

        FormulaResult result = formula.compute(input);

        double diameterCm = 0.2;
        double lengthCm = 2.0;
        double volumePerPiece = Math.PI * Math.pow(diameterCm / 2.0, 2) * lengthCm;
        double expectedVolume = volumePerPiece * 11.0 / 1_000_000.0;
        double expectedWeight = (volumePerPiece * DENSITY / 1000.0) * 11.0;

        assertEquals(expectedWeight, result.getWeightKg(), TOLERANCE);
        assertEquals(expectedVolume, result.getVolumeM3(), TOLERANCE);
    }

    @Test
    void screwMachineWeightToQtyMatchesExpected() {
        Formula formula = new ScrewMachineFormula();
        Map<String, Double> dimensions = Map.of("diameter", 0.2, "length", 2.0);
        double targetWeight = 0.02;
        FormulaInput input = new FormulaInput(dimensions, DENSITY, targetWeight, CalculationMode.WEIGHT_TO_QTY);

        FormulaResult result = formula.compute(input);

        double diameterCm = 0.2;
        double lengthCm = 2.0;
        double volumePerPiece = Math.PI * Math.pow(diameterCm / 2.0, 2) * lengthCm;
        double massPerPieceKg = (volumePerPiece * DENSITY) / 1000.0;
        double expectedQuantity = targetWeight / massPerPieceKg;
        double expectedVolume = (volumePerPiece * expectedQuantity) / 1_000_000.0;

        assertEquals(targetWeight, result.getWeightKg(), TOLERANCE);
        assertEquals(expectedQuantity, result.getQuantity(), TOLERANCE);
        assertEquals(expectedVolume, result.getVolumeM3(), TOLERANCE);
    }

    @Test
    void nutHexQtyToWeightMatchesExpected() {
        Formula formula = new NutHexFormula();
        Map<String, Double> dimensions = Map.of("diameter", 1.0, "thickness", 0.5);
        FormulaInput input = new FormulaInput(dimensions, DENSITY, 8.0, CalculationMode.QTY_TO_WEIGHT);

        FormulaResult result = formula.compute(input);

        double innerDiameterCm = 1.0;
        double outerDiameterCm = innerDiameterCm * 1.6;
        double thicknessCm = 0.5;
        double volumePerPiece = Math.PI
            * (Math.pow(outerDiameterCm / 2.0, 2) - Math.pow(innerDiameterCm / 2.0, 2))
            * thicknessCm;
        double expectedVolume = volumePerPiece * 8.0 / 1_000_000.0;
        double expectedWeight = (volumePerPiece * DENSITY / 1000.0) * 8.0;

        assertEquals(expectedWeight, result.getWeightKg(), TOLERANCE);
        assertEquals(expectedVolume, result.getVolumeM3(), TOLERANCE);
    }

    @Test
    void nutHexWeightToQtyMatchesExpected() {
        Formula formula = new NutHexFormula();
        Map<String, Double> dimensions = Map.of("diameter", 1.0, "thickness", 0.5);
        double targetWeight = 0.05;
        FormulaInput input = new FormulaInput(dimensions, DENSITY, targetWeight, CalculationMode.WEIGHT_TO_QTY);

        FormulaResult result = formula.compute(input);

        double innerDiameterCm = 1.0;
        double outerDiameterCm = innerDiameterCm * 1.6;
        double thicknessCm = 0.5;
        double volumePerPiece = Math.PI
            * (Math.pow(outerDiameterCm / 2.0, 2) - Math.pow(innerDiameterCm / 2.0, 2))
            * thicknessCm;
        double massPerPieceKg = (volumePerPiece * DENSITY) / 1000.0;
        double expectedQuantity = targetWeight / massPerPieceKg;
        double expectedVolume = (volumePerPiece * expectedQuantity) / 1_000_000.0;

        assertEquals(targetWeight, result.getWeightKg(), TOLERANCE);
        assertEquals(expectedQuantity, result.getQuantity(), TOLERANCE);
        assertEquals(expectedVolume, result.getVolumeM3(), TOLERANCE);
    }
}
