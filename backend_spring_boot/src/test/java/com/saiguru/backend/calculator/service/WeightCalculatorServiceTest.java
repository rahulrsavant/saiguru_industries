package com.saiguru.backend.calculator.service;

import com.saiguru.backend.calculator.model.CalculationRequest;
import com.saiguru.backend.calculator.model.DimensionInput;

import java.util.List;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class WeightCalculatorServiceTest {
    private final WeightCalculatorService service = new WeightCalculatorService();

    @Test
    void calculatesRoundBarSteel() {
        CalculationRequest request = new CalculationRequest(
            "steel",
            "round_bar",
            1,
            List.of(
                new DimensionInput("diameter", 2.0, "in"),
                new DimensionInput("length", 10.0, "in")
            )
        );

        double expectedVolume = Math.PI * Math.pow(1.0, 2) * 10.0;
        double expectedWeight = expectedVolume * 0.2836;

        var response = service.calculate(request);
        assertEquals(expectedVolume, response.getVolumeIn3(), 0.0001);
        assertEquals(expectedWeight, response.getWeightLbs(), 0.0001);
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

        double expectedVolume = 0.5 * 12.0 * 24.0;
        double expectedWeight = expectedVolume * 0.0975;

        var response = service.calculate(request);
        assertEquals(expectedVolume, response.getVolumeIn3(), 0.0001);
        assertEquals(expectedWeight, response.getWeightLbs(), 0.0001);
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
        double expectedVolume = Math.PI * (Math.pow(outerRadius, 2) - Math.pow(innerRadius, 2)) * 12.0;
        double expectedWeight = expectedVolume * 0.2890;

        var response = service.calculate(request);
        assertEquals(expectedVolume, response.getVolumeIn3(), 0.0001);
        assertEquals(expectedWeight, response.getWeightLbs(), 0.0001);
    }
}
