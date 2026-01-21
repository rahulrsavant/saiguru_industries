package com.saiguru.backend.calculator.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.saiguru.backend.calculator.catalog.CatalogService;
import com.saiguru.backend.calculator.density.DensityCatalogService;
import com.saiguru.backend.calculator.formula.FormulaRegistry;
import com.saiguru.backend.calculator.model.CalculationMode;
import com.saiguru.backend.calculator.model.CalculationRequestV2;
import com.saiguru.backend.calculator.model.DimensionInput;

import java.util.List;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class CalculationEngineServiceTest {
    private static final double RAW_TOLERANCE = 1e-9;

    private final CalculationEngineService service = new CalculationEngineService(
        new CatalogService(new ObjectMapper()),
        new FormulaRegistry(),
        new DensityCatalogService(new ObjectMapper())
    );

    @Test
    void calculatesRoundBarWeightFromQuantity() {
        CalculationRequestV2 request = new CalculationRequestV2();
        request.setCalculatorId("rolled_round_bar");
        request.setMetal("steel");
        request.setAlloy("carbon");
        request.setPiecesOrQty(2.0);
        request.setMode(CalculationMode.QTY_TO_WEIGHT);
        request.setDimensions(List.of(
            new DimensionInput("diameter", 10.0, "mm"),
            new DimensionInput("length", 1000.0, "mm")
        ));

        double density = 7.85;
        double radiusCm = 0.5;
        double lengthCm = 100.0;
        double volumePerPieceCm3 = Math.PI * radiusCm * radiusCm * lengthCm;
        double expectedVolume = (volumePerPieceCm3 * 2.0) / 1_000_000.0;
        double expectedWeight = (volumePerPieceCm3 * density / 1000.0) * 2.0;

        var response = service.calculate(request);
        assertEquals(expectedVolume, response.getVolumeM3Raw(), RAW_TOLERANCE);
        assertEquals(expectedWeight, response.getWeightKgRaw(), RAW_TOLERANCE);
        assertEquals(2.0, response.getQuantityRaw(), RAW_TOLERANCE);
    }

    @Test
    void calculatesSquareBarWeightFromQuantity() {
        CalculationRequestV2 request = new CalculationRequestV2();
        request.setCalculatorId("rolled_square_bar");
        request.setMetal("aluminum");
        request.setAlloy("6061");
        request.setPiecesOrQty(3.0);
        request.setMode(CalculationMode.QTY_TO_WEIGHT);
        request.setDimensions(List.of(
            new DimensionInput("width", 25.4, "mm"),
            new DimensionInput("length", 2.0, "m")
        ));

        double density = 2.6988;
        double widthCm = 2.54;
        double lengthCm = 200.0;
        double volumePerPieceCm3 = widthCm * widthCm * lengthCm;
        double expectedVolume = (volumePerPieceCm3 * 3.0) / 1_000_000.0;
        double expectedWeight = (volumePerPieceCm3 * density / 1000.0) * 3.0;

        var response = service.calculate(request);
        assertEquals(expectedVolume, response.getVolumeM3Raw(), RAW_TOLERANCE);
        assertEquals(expectedWeight, response.getWeightKgRaw(), RAW_TOLERANCE);
        assertEquals(3.0, response.getQuantityRaw(), RAW_TOLERANCE);
    }

    @Test
    void calculatesPipeRoundQuantityFromWeight() {
        CalculationRequestV2 request = new CalculationRequestV2();
        request.setCalculatorId("rolled_pipe_round");
        request.setMetal("steel");
        request.setAlloy("carbon");
        request.setPiecesOrQty(12.5);
        request.setMode(CalculationMode.WEIGHT_TO_QTY);
        request.setDimensions(List.of(
            new DimensionInput("outside_diameter", 2.0, "in"),
            new DimensionInput("wall_thickness", 0.25, "in"),
            new DimensionInput("length", 100.0, "cm")
        ));

        double density = 7.85;
        double outsideDiameterCm = 2.0 * 2.54;
        double wallCm = 0.25 * 2.54;
        double lengthCm = 100.0;
        double outerRadius = outsideDiameterCm / 2.0;
        double innerRadius = outerRadius - wallCm;
        double volumePerPieceCm3 = Math.PI * (outerRadius * outerRadius - innerRadius * innerRadius) * lengthCm;
        double unitWeightKg = (volumePerPieceCm3 * density) / 1000.0;
        double expectedQuantity = 12.5 / unitWeightKg;
        double expectedVolume = (volumePerPieceCm3 * expectedQuantity) / 1_000_000.0;

        var response = service.calculate(request);
        assertEquals(expectedQuantity, response.getQuantityRaw(), RAW_TOLERANCE);
        assertEquals(expectedVolume, response.getVolumeM3Raw(), RAW_TOLERANCE);
        assertEquals(12.5, response.getWeightKgRaw(), RAW_TOLERANCE);
    }

    @Test
    void calculatesAngleEqualWeightFromQuantity() {
        CalculationRequestV2 request = new CalculationRequestV2();
        request.setCalculatorId("rolled_angle_equal");
        request.setMetal("steel");
        request.setAlloy("carbon");
        request.setPiecesOrQty(4.0);
        request.setMode(CalculationMode.QTY_TO_WEIGHT);
        request.setDimensions(List.of(
            new DimensionInput("leg", 50.0, "mm"),
            new DimensionInput("thickness", 5.0, "mm"),
            new DimensionInput("length", 1.0, "m")
        ));

        double density = 7.85;
        double legCm = 5.0;
        double thicknessCm = 0.5;
        double lengthCm = 100.0;
        double volumePerPieceCm3 = thicknessCm * (2.0 * legCm - thicknessCm) * lengthCm;
        double expectedVolume = (volumePerPieceCm3 * 4.0) / 1_000_000.0;
        double expectedWeight = (volumePerPieceCm3 * density / 1000.0) * 4.0;

        var response = service.calculate(request);
        assertEquals(expectedVolume, response.getVolumeM3Raw(), RAW_TOLERANCE);
        assertEquals(expectedWeight, response.getWeightKgRaw(), RAW_TOLERANCE);
        assertEquals(4.0, response.getQuantityRaw(), RAW_TOLERANCE);
    }

    @Test
    void calculatesChannelWeightFromQuantity() {
        CalculationRequestV2 request = new CalculationRequestV2();
        request.setCalculatorId("rolled_channel_c");
        request.setMetal("steel");
        request.setAlloy("carbon");
        request.setPiecesOrQty(3.0);
        request.setMode(CalculationMode.QTY_TO_WEIGHT);
        request.setDimensions(List.of(
            new DimensionInput("height", 150.0, "mm"),
            new DimensionInput("flange_width", 50.0, "mm"),
            new DimensionInput("web_thickness", 6.0, "mm"),
            new DimensionInput("flange_thickness", 8.0, "mm"),
            new DimensionInput("length", 2.0, "m")
        ));

        double density = 7.85;
        double heightCm = 15.0;
        double flangeWidthCm = 5.0;
        double webThicknessCm = 0.6;
        double flangeThicknessCm = 0.8;
        double lengthCm = 200.0;
        double webArea = heightCm * webThicknessCm;
        double flangeArea = flangeWidthCm * flangeThicknessCm;
        double overlapArea = webThicknessCm * flangeThicknessCm;
        double crossSectionArea = webArea + 2.0 * flangeArea - 2.0 * overlapArea;
        double volumePerPieceCm3 = crossSectionArea * lengthCm;
        double expectedVolume = (volumePerPieceCm3 * 3.0) / 1_000_000.0;
        double expectedWeight = (volumePerPieceCm3 * density / 1000.0) * 3.0;

        var response = service.calculate(request);
        assertEquals(expectedVolume, response.getVolumeM3Raw(), RAW_TOLERANCE);
        assertEquals(expectedWeight, response.getWeightKgRaw(), RAW_TOLERANCE);
        assertEquals(3.0, response.getQuantityRaw(), RAW_TOLERANCE);
    }

    @Test
    void calculatesBeamIQuantityFromWeight() {
        CalculationRequestV2 request = new CalculationRequestV2();
        request.setCalculatorId("rolled_beam_i");
        request.setMetal("steel");
        request.setAlloy("carbon");
        request.setPiecesOrQty(1200.0);
        request.setMode(CalculationMode.WEIGHT_TO_QTY);
        request.setDimensions(List.of(
            new DimensionInput("height", 300.0, "mm"),
            new DimensionInput("flange_width", 150.0, "mm"),
            new DimensionInput("web_thickness", 10.0, "mm"),
            new DimensionInput("flange_thickness", 15.0, "mm"),
            new DimensionInput("length", 6.0, "m")
        ));

        double density = 7.85;
        double heightCm = 30.0;
        double flangeWidthCm = 15.0;
        double webThicknessCm = 1.0;
        double flangeThicknessCm = 1.5;
        double lengthCm = 600.0;
        double webHeight = heightCm - 2.0 * flangeThicknessCm;
        double crossSectionArea = 2.0 * flangeWidthCm * flangeThicknessCm + webHeight * webThicknessCm;
        double volumePerPieceCm3 = crossSectionArea * lengthCm;
        double unitWeightKg = (volumePerPieceCm3 * density) / 1000.0;
        double expectedQuantity = 1200.0 / unitWeightKg;
        double expectedVolume = (volumePerPieceCm3 * expectedQuantity) / 1_000_000.0;

        var response = service.calculate(request);
        assertEquals(expectedQuantity, response.getQuantityRaw(), RAW_TOLERANCE);
        assertEquals(expectedVolume, response.getVolumeM3Raw(), RAW_TOLERANCE);
        assertEquals(1200.0, response.getWeightKgRaw(), RAW_TOLERANCE);
    }
}
