package com.saiguru.backend.calculator.service;

import com.saiguru.backend.calculator.config.AlloyDensityCatalog;
import com.saiguru.backend.calculator.config.ShapeCatalog;
import com.saiguru.backend.calculator.config.ShapeDefinition;
import com.saiguru.backend.calculator.model.CalculationRequest;
import com.saiguru.backend.calculator.model.CalculationResponse;
import com.saiguru.backend.calculator.model.DimensionInput;
import com.saiguru.backend.calculator.util.UnitConverter;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

@Service
public class WeightCalculatorService {
    public CalculationResponse calculate(CalculationRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Request body is required.");
        }

        ShapeDefinition shape = ShapeCatalog.SHAPES.get(request.getShape());
        if (shape == null) {
            throw new IllegalArgumentException("Unsupported shape: " + request.getShape());
        }

        Double density = AlloyDensityCatalog.DENSITIES_LB_PER_IN3.get(request.getAlloy());
        if (density == null) {
            throw new IllegalArgumentException("Unsupported alloy: " + request.getAlloy());
        }

        int pieces = request.getPieces() == null ? 0 : request.getPieces();
        if (pieces < 1) {
            throw new IllegalArgumentException("Number of pieces must be at least 1.");
        }

        Map<String, Double> dimensionValues = normalizeDimensions(request.getDimensions());

        for (var field : shape.getFields()) {
            Double value = dimensionValues.get(field.getKey());
            if (value == null || value <= 0) {
                throw new IllegalArgumentException("Missing or invalid dimension: " + field.getLabel());
            }
        }

        validateShapeSpecificRules(request.getShape(), dimensionValues);

        double volumeIn3 = shape.getVolumeFormula().compute(dimensionValues);
        double weightLbs = volumeIn3 * density * pieces;

        return new CalculationResponse(weightLbs, volumeIn3);
    }

    private Map<String, Double> normalizeDimensions(List<DimensionInput> dimensions) {
        if (dimensions == null || dimensions.isEmpty()) {
            throw new IllegalArgumentException("Dimensions are required.");
        }

        Map<String, Double> normalized = new HashMap<>();
        for (DimensionInput input : dimensions) {
            if (input == null || input.getKey() == null) {
                continue;
            }
            if (input.getValue() == null) {
                throw new IllegalArgumentException("Dimension value is required for " + input.getKey());
            }
            if (input.getUnit() == null) {
                throw new IllegalArgumentException("Dimension unit is required for " + input.getKey());
            }
            if (input.getValue() < 0) {
                throw new IllegalArgumentException("Dimension values cannot be negative.");
            }
            double inches = UnitConverter.toInches(input.getValue(), input.getUnit());
            normalized.put(input.getKey(), inches);
        }
        return normalized;
    }

    private void validateShapeSpecificRules(String shapeKey, Map<String, Double> dimensions) {
        if ("tubular".equals(shapeKey)) {
            double outsideDiameter = dimensions.get("outside_diameter");
            double wallThickness = dimensions.get("wall_thickness");
            if (wallThickness >= outsideDiameter / 2.0) {
                throw new IllegalArgumentException("Wall thickness must be less than half of the outside diameter.");
            }
            if ((outsideDiameter - 2 * wallThickness) <= 0) {
                throw new IllegalArgumentException("Calculated inside diameter must be greater than zero.");
            }
        }

        if ("ring".equals(shapeKey)) {
            double outsideDiameter = dimensions.get("outside_diameter");
            double insideDiameter = dimensions.get("inside_diameter");
            if (insideDiameter >= outsideDiameter) {
                throw new IllegalArgumentException("Inside diameter must be smaller than the outside diameter.");
            }
        }
    }
}
