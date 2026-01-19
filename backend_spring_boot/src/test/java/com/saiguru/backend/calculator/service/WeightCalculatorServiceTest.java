package com.saiguru.backend.calculator.service;

import com.saiguru.backend.calculator.model.CalculationRequest;
import com.saiguru.backend.calculator.model.DimensionInput;
import com.saiguru.backend.calculator.util.RoundingUtil;
import com.saiguru.backend.calculator.util.UnitConverter;

import java.util.List;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class WeightCalculatorServiceTest {
    private final WeightCalculatorService service = new WeightCalculatorService();
    private static final double RAW_TOLERANCE = 1e-9;

    @Test
    void calculatesRoundBarAluminumWithRawPrecision() {
        CalculationRequest request = new CalculationRequest(
            "aluminum_1100",
            "round_bar",
            11,
            List.of(
                new DimensionInput("diameter", 1.0, "in"),
                new DimensionInput("length", 1.0, "in")
            )
        );

        double expectedVolumeRaw = Math.PI * Math.pow(0.5, 2) * 1.0;
        double expectedWeightRaw = expectedVolumeRaw * 0.0975 * 11.0;

        var response = service.calculate(request);
        assertEquals(expectedVolumeRaw, response.getVolumeIn3Raw(), RAW_TOLERANCE);
        assertEquals(expectedWeightRaw, response.getWeightLbsRaw(), RAW_TOLERANCE);
        assertEquals(RoundingUtil.round(expectedVolumeRaw, 4), response.getVolumeIn3(), 0.0001);
        assertEquals(RoundingUtil.round(expectedWeightRaw, 4), response.getWeightLbs(), 0.0001);
    }

    @Test
    void calculatesPlateAluminum6061() {
        CalculationRequest request = new CalculationRequest(
            "aluminum_6061",
            "plate",
            1,
            List.of(
                new DimensionInput("thickness", 0.5, "in"),
                new DimensionInput("width", 12.0, "in"),
                new DimensionInput("length", 24.0, "in")
            )
        );

        double expectedVolumeRaw = 0.5 * 12.0 * 24.0;
        double expectedWeightRaw = expectedVolumeRaw * 0.0975;

        var response = service.calculate(request);
        assertEquals(expectedVolumeRaw, response.getVolumeIn3Raw(), RAW_TOLERANCE);
        assertEquals(expectedWeightRaw, response.getWeightLbsRaw(), RAW_TOLERANCE);
        assertEquals(RoundingUtil.round(expectedVolumeRaw, 4), response.getVolumeIn3(), 0.0001);
        assertEquals(RoundingUtil.round(expectedWeightRaw, 4), response.getWeightLbs(), 0.0001);
    }

    @Test
    void calculatesTubularStainless() {
        CalculationRequest request = new CalculationRequest(
            "stainless_steel_300",
            "tubular",
            1,
            List.of(
                new DimensionInput("outside_diameter", 4.0, "in"),
                new DimensionInput("wall_thickness", 0.5, "in"),
                new DimensionInput("length", 12.0, "in")
            )
        );

        double outerRadius = 2.0;
        double innerRadius = 1.5;
        double expectedVolumeRaw = Math.PI * (Math.pow(outerRadius, 2) - Math.pow(innerRadius, 2)) * 12.0;
        double expectedWeightRaw = expectedVolumeRaw * 0.2890;

        var response = service.calculate(request);
        assertEquals(expectedVolumeRaw, response.getVolumeIn3Raw(), RAW_TOLERANCE);
        assertEquals(expectedWeightRaw, response.getWeightLbsRaw(), RAW_TOLERANCE);
        assertEquals(RoundingUtil.round(expectedVolumeRaw, 4), response.getVolumeIn3(), 0.0001);
        assertEquals(RoundingUtil.round(expectedWeightRaw, 4), response.getWeightLbs(), 0.0001);
    }

    @Test
    void calculatesRingSteel() {
        CalculationRequest request = new CalculationRequest(
            "steel",
            "ring",
            2,
            List.of(
                new DimensionInput("outside_diameter", 4.0, "in"),
                new DimensionInput("inside_diameter", 2.0, "in"),
                new DimensionInput("thickness", 1.0, "in")
            )
        );

        double outerRadius = 2.0;
        double innerRadius = 1.0;
        double expectedVolumeRaw = Math.PI * (Math.pow(outerRadius, 2) - Math.pow(innerRadius, 2)) * 1.0;
        double expectedWeightRaw = expectedVolumeRaw * 0.2836 * 2.0;

        var response = service.calculate(request);
        assertEquals(expectedVolumeRaw, response.getVolumeIn3Raw(), RAW_TOLERANCE);
        assertEquals(expectedWeightRaw, response.getWeightLbsRaw(), RAW_TOLERANCE);
        assertEquals(RoundingUtil.round(expectedVolumeRaw, 4), response.getVolumeIn3(), 0.0001);
        assertEquals(RoundingUtil.round(expectedWeightRaw, 4), response.getWeightLbs(), 0.0001);
    }

    @Test
    void convertsUnitsBeforeVolumeCalculation() {
        CalculationRequest request = new CalculationRequest(
            "steel",
            "round_bar",
            1,
            List.of(
                new DimensionInput("diameter", 25.4, "mm"),
                new DimensionInput("length", 1.0, "ft")
            )
        );

        double diameterIn = UnitConverter.toInches(25.4, "mm");
        double lengthIn = UnitConverter.toInches(1.0, "ft");
        double expectedVolumeRaw = Math.PI * Math.pow(diameterIn / 2.0, 2) * lengthIn;
        double expectedWeightRaw = expectedVolumeRaw * 0.2836;

        var response = service.calculate(request);
        assertEquals(expectedVolumeRaw, response.getVolumeIn3Raw(), RAW_TOLERANCE);
        assertEquals(expectedWeightRaw, response.getWeightLbsRaw(), RAW_TOLERANCE);
    }
}
