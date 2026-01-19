package com.saiguru.backend.calculator.service;

import com.saiguru.backend.calculator.config.AlloyDensityCatalog;
import com.saiguru.backend.calculator.config.ShapeCatalog;
import com.saiguru.backend.calculator.config.ShapeDefinition;
import com.saiguru.backend.calculator.model.CalculationRequest;
import com.saiguru.backend.calculator.model.CalculationResponse;
import com.saiguru.backend.calculator.model.DimensionInput;
import com.saiguru.backend.calculator.model.ValidationException;
import com.saiguru.backend.calculator.util.RoundingUtil;
import com.saiguru.backend.calculator.util.UnitConverter;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

@Service
public class WeightCalculatorService {
    public CalculationResponse calculate(CalculationRequest request) {
        if (request == null) {
            throw new ValidationException("Request body is required.", "request");
        }

        String shapeKey = normalizeRequired(request.getShape(), "shape");
        String alloyKey = normalizeRequired(request.getAlloy(), "alloy");

        ShapeDefinition shape = ShapeCatalog.SHAPES.get(shapeKey);
        if (shape == null) {
            throw new ValidationException("Unsupported shape: " + shapeKey, "shape");
        }

        Double density = AlloyDensityCatalog.DENSITIES_LB_PER_IN3.get(alloyKey);
        if (density == null) {
            throw new ValidationException("Unsupported alloy: " + alloyKey, "alloy");
        }

        int pieces = request.getPieces() == null ? 1 : request.getPieces();
        if (pieces < 1) {
            throw new ValidationException("Number of pieces must be at least 1.", "pieces");
        }

        Map<String, Double> dimensionValues = normalizeDimensions(request.getDimensions());

        for (var field : shape.getFields()) {
            Double value = dimensionValues.get(field.getKey());
            if (value == null || value <= 0) {
                throw new ValidationException("Missing or invalid dimension: " + field.getLabel(), field.getKey());
            }
        }

        validateShapeSpecificRules(shapeKey, dimensionValues);

        double volumeIn3Raw = shape.getVolumeFormula().compute(dimensionValues);
        double weightLbsRaw = volumeIn3Raw * density * pieces;

        CalculationResponse response = new CalculationResponse();
        response.setVolumeIn3Raw(volumeIn3Raw);
        response.setWeightLbsRaw(weightLbsRaw);
        response.setVolumeIn3(RoundingUtil.round(volumeIn3Raw, 4));
        response.setWeightLbs(RoundingUtil.round(weightLbsRaw, 4));

        if (Boolean.TRUE.equals(request.getDebug())) {
            response.setDensityUsedLbPerIn3(density);
            response.setPieces(pieces);
            response.setNormalizedDimensionsInInches(dimensionValues);
        }

        return response;
    }

    private Map<String, Double> normalizeDimensions(List<DimensionInput> dimensions) {
        if (dimensions == null || dimensions.isEmpty()) {
            throw new ValidationException("Dimensions are required.", "dimensions");
        }

        Map<String, Double> normalized = new HashMap<>();
        for (DimensionInput input : dimensions) {
            if (input == null) {
                throw new ValidationException("Dimension entry is required.", "dimensions");
            }
            String key = normalizeRequired(input.getKey(), "dimensions.key");
            Double value = input.getValue();
            if (value == null) {
                throw new ValidationException("Dimension value is required for " + key, key);
            }
            if (value <= 0) {
                throw new ValidationException("Dimension value must be greater than zero for " + key, key);
            }
            String unit = normalizeRequired(input.getUnit(), key);
            double inches;
            try {
                inches = UnitConverter.toInches(value, unit);
            } catch (IllegalArgumentException exception) {
                throw new ValidationException(exception.getMessage(), key);
            }
            normalized.put(key, inches);
        }
        return normalized;
    }

    private void validateShapeSpecificRules(String shapeKey, Map<String, Double> dimensions) {
        if ("tubular".equals(shapeKey)) {
            double outsideDiameter = dimensions.get("outside_diameter");
            double wallThickness = dimensions.get("wall_thickness");
            if (wallThickness >= outsideDiameter / 2.0) {
                throw new ValidationException(
                    "Wall thickness must be less than half of the outside diameter.",
                    "wall_thickness"
                );
            }
            if ((outsideDiameter - 2 * wallThickness) <= 0) {
                throw new ValidationException("Calculated inside diameter must be greater than zero.", "wall_thickness");
            }
        }

        if ("ring".equals(shapeKey)) {
            double outsideDiameter = dimensions.get("outside_diameter");
            double insideDiameter = dimensions.get("inside_diameter");
            if (insideDiameter >= outsideDiameter) {
                throw new ValidationException("Inside diameter must be smaller than the outside diameter.", "inside_diameter");
            }
        }
    }

    private String normalizeRequired(String value, String field) {
        if (value == null) {
            throw new ValidationException("Value is required.", field);
        }
        String normalized = value.trim().toLowerCase();
        if (normalized.isEmpty()) {
            throw new ValidationException("Value is required.", field);
        }
        return normalized;
    }
}
