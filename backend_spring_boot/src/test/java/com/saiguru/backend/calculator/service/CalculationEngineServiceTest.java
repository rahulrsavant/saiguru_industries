package com.saiguru.backend.calculator.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.saiguru.backend.calculator.catalog.CatalogService;
import com.saiguru.backend.calculator.config.AlloyDensityCatalog;
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
        new FormulaRegistry()
    );

    @Test
    void calculatesRoundBarWeightFromQuantity() {
        CalculationRequestV2 request = new CalculationRequestV2();
        request.setCalculatorId("rolled_round_bar");
        request.setMaterialId("steel");
        request.setPiecesOrQty(2.0);
        request.setMode(CalculationMode.QTY_TO_WEIGHT);
        request.setDimensions(List.of(
            new DimensionInput("diameter", 10.0, "mm"),
            new DimensionInput("length", 1000.0, "mm")
        ));

        double density = AlloyDensityCatalog.DENSITIES_KG_PER_M3.get("steel");
        double radius = 5.0;
        double volumePerPieceM3 = Math.PI * radius * radius * 1000.0 / 1_000_000_000.0;
        double expectedVolume = volumePerPieceM3 * 2.0;
        double expectedWeight = expectedVolume * density;

        var response = service.calculate(request);
        assertEquals(expectedVolume, response.getVolumeM3Raw(), RAW_TOLERANCE);
        assertEquals(expectedWeight, response.getWeightKgRaw(), RAW_TOLERANCE);
        assertEquals(2.0, response.getQuantityRaw(), RAW_TOLERANCE);
    }

    @Test
    void calculatesSquareBarWeightFromQuantity() {
        CalculationRequestV2 request = new CalculationRequestV2();
        request.setCalculatorId("rolled_square_bar");
        request.setMaterialId("aluminum_6061");
        request.setPiecesOrQty(3.0);
        request.setMode(CalculationMode.QTY_TO_WEIGHT);
        request.setDimensions(List.of(
            new DimensionInput("width", 25.4, "mm"),
            new DimensionInput("length", 2.0, "m")
        ));

        double density = AlloyDensityCatalog.DENSITIES_KG_PER_M3.get("aluminum_6061");
        double volumePerPieceM3 = 25.4 * 25.4 * 2000.0 / 1_000_000_000.0;
        double expectedVolume = volumePerPieceM3 * 3.0;
        double expectedWeight = expectedVolume * density;

        var response = service.calculate(request);
        assertEquals(expectedVolume, response.getVolumeM3Raw(), RAW_TOLERANCE);
        assertEquals(expectedWeight, response.getWeightKgRaw(), RAW_TOLERANCE);
        assertEquals(3.0, response.getQuantityRaw(), RAW_TOLERANCE);
    }

    @Test
    void calculatesPipeRoundQuantityFromWeight() {
        CalculationRequestV2 request = new CalculationRequestV2();
        request.setCalculatorId("rolled_pipe_round");
        request.setMaterialId("steel");
        request.setPiecesOrQty(12.5);
        request.setMode(CalculationMode.WEIGHT_TO_QTY);
        request.setDimensions(List.of(
            new DimensionInput("outside_diameter", 2.0, "in"),
            new DimensionInput("wall_thickness", 0.25, "in"),
            new DimensionInput("length", 100.0, "cm")
        ));

        double density = AlloyDensityCatalog.DENSITIES_KG_PER_M3.get("steel");
        double outsideDiameterMm = 2.0 * 25.4;
        double wallMm = 0.25 * 25.4;
        double lengthMm = 1000.0;
        double outerRadius = outsideDiameterMm / 2.0;
        double innerRadius = outerRadius - wallMm;
        double volumePerPieceM3 = Math.PI * (outerRadius * outerRadius - innerRadius * innerRadius) * lengthMm
            / 1_000_000_000.0;
        double expectedQuantity = 12.5 / (volumePerPieceM3 * density);
        double expectedVolume = volumePerPieceM3 * expectedQuantity;

        var response = service.calculate(request);
        assertEquals(expectedQuantity, response.getQuantityRaw(), RAW_TOLERANCE);
        assertEquals(expectedVolume, response.getVolumeM3Raw(), RAW_TOLERANCE);
        assertEquals(12.5, response.getWeightKgRaw(), RAW_TOLERANCE);
    }
}
