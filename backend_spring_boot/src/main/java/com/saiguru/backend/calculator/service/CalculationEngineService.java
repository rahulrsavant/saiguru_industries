package com.saiguru.backend.calculator.service;

import com.saiguru.backend.calculator.catalog.CatalogCalculator;
import com.saiguru.backend.calculator.catalog.CatalogField;
import com.saiguru.backend.calculator.catalog.CatalogService;
import com.saiguru.backend.calculator.density.DensityCatalogService;
import com.saiguru.backend.calculator.formula.Formula;
import com.saiguru.backend.calculator.formula.FormulaInput;
import com.saiguru.backend.calculator.formula.FormulaRegistry;
import com.saiguru.backend.calculator.formula.FormulaResult;
import com.saiguru.backend.calculator.model.CalculationMode;
import com.saiguru.backend.calculator.model.CalculationRequestV2;
import com.saiguru.backend.calculator.model.CalculationResult;
import com.saiguru.backend.calculator.model.DimensionInput;
import com.saiguru.backend.calculator.model.ValidationException;
import com.saiguru.backend.calculator.util.RoundingUtil;
import com.saiguru.backend.calculator.util.UnitConverter;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

@Service
public class CalculationEngineService {
    private static final int ROUNDING_SCALE = 4;

    private final CatalogService catalogService;
    private final FormulaRegistry formulaRegistry;
    private final DensityCatalogService densityCatalogService;

    public CalculationEngineService(
        CatalogService catalogService,
        FormulaRegistry formulaRegistry,
        DensityCatalogService densityCatalogService
    ) {
        this.catalogService = catalogService;
        this.formulaRegistry = formulaRegistry;
        this.densityCatalogService = densityCatalogService;
    }

    public CalculationResult calculate(CalculationRequestV2 request) {
        if (request == null) {
            throw new ValidationException("Request body is required.", "request");
        }

        String calculatorId = normalizeRequired(request.getCalculatorId(), "calculatorId");
        String metal = normalizeRequired(request.getMetal(), "metal");
        String alloy = normalizeRequired(request.getAlloy(), "alloy");

        CatalogCalculator calculator = catalogService.getCalculator(calculatorId);
        if (calculator == null) {
            throw new ValidationException("Unsupported calculator: " + calculatorId, "calculatorId");
        }

        Double density = densityCatalogService.getDensity(metal, alloy);
        if (density == null) {
            throw new ValidationException("Unsupported alloy density for " + metal + " / " + alloy + ".", "alloy");
        }

        CalculationMode mode = request.getMode() == null ? CalculationMode.QTY_TO_WEIGHT : request.getMode();
        double piecesOrQty = request.getPiecesOrQty() == null ? 0.0 : request.getPiecesOrQty();
        if (piecesOrQty <= 0) {
            throw new ValidationException("Quantity or weight must be greater than zero.", "piecesOrQty");
        }

        Map<String, Double> normalizedDimensions = normalizeDimensions(request.getDimensions(), calculator.getFields());
        validateFormulaSpecificRules(calculator.getFormulaKey(), normalizedDimensions);

        Formula formula = formulaRegistry.getFormula(calculator.getFormulaKey());
        if (formula == null) {
            throw new ValidationException("Formula not implemented yet for: " + calculator.getFormulaKey(), "formulaKey");
        }

        FormulaResult result = formula.compute(new FormulaInput(normalizedDimensions, density, piecesOrQty, mode));

        CalculationResult response = new CalculationResult();
        response.setWeightKgRaw(result.getWeightKg());
        response.setVolumeM3Raw(result.getVolumeM3());
        response.setWeightKg(RoundingUtil.round(result.getWeightKg(), ROUNDING_SCALE));
        response.setTotalWeightKg(RoundingUtil.round(result.getWeightKg(), ROUNDING_SCALE));
        response.setVolumeM3(RoundingUtil.round(result.getVolumeM3(), ROUNDING_SCALE));
        response.setQuantityRaw(result.getQuantity());
        response.setQuantity(RoundingUtil.round(result.getQuantity(), ROUNDING_SCALE));
        response.setUnitWeightKg(RoundingUtil.round(result.getUnitWeightKg(), ROUNDING_SCALE));
        response.setDensityGPerCm3(density);
        response.setMetal(metal);
        response.setAlloy(alloy);
        response.setMode(mode);

        if (Boolean.TRUE.equals(request.getDebug())) {
            response.setDensityGPerCm3(density);
            response.setVolumePerPieceM3(result.getVolumePerPieceCm3() / 1_000_000.0);
            response.setNormalizedDimensionsMm(convertCmToMm(normalizedDimensions));
        }

        return response;
    }

    private Map<String, Double> normalizeDimensions(List<DimensionInput> dimensions, List<CatalogField> fields) {
        if (dimensions == null || dimensions.isEmpty()) {
            throw new ValidationException("Dimensions are required.", "dimensions");
        }

        Map<String, CatalogField> fieldLookup = new HashMap<>();
        for (CatalogField field : fields) {
            fieldLookup.put(field.getKey(), field);
        }

        Map<String, Double> normalized = new HashMap<>();
        for (DimensionInput input : dimensions) {
            if (input == null) {
                throw new ValidationException("Dimension entry is required.", "dimensions");
            }
            String key = normalizeRequired(input.getKey(), "dimensions.key");
            CatalogField field = fieldLookup.get(key);
            if (field == null) {
                throw new ValidationException("Unsupported dimension key: " + key, key);
            }
            Double value = input.getValue();
            if (value == null) {
                throw new ValidationException("Dimension value is required for " + key, key);
            }
            if (value <= 0) {
                throw new ValidationException("Dimension value must be greater than zero for " + key, key);
            }
            String unit = normalizeRequired(input.getUnit(), key);
            if (field.getAllowedUnits() != null && !field.getAllowedUnits().contains(unit)) {
                throw new ValidationException("Unit not allowed for " + field.getLabel() + ".", key);
            }
            double centimeters;
            try {
                centimeters = UnitConverter.toCentimeters(value, unit);
            } catch (IllegalArgumentException exception) {
                throw new ValidationException(exception.getMessage(), key);
            }
            normalized.put(key, centimeters);
        }

        for (CatalogField field : fields) {
            Double value = normalized.get(field.getKey());
            if (field.isRequired() && (value == null || value <= 0)) {
                throw new ValidationException("Missing or invalid dimension: " + field.getLabel(), field.getKey());
            }
            if (value != null && field.getMinValue() != null) {
                double minValueCm = field.getMinValue() / 10.0;
                if (value < minValueCm) {
                throw new ValidationException(
                    "Value for " + field.getLabel() + " must be at least " + field.getMinValue() + ".",
                    field.getKey()
                );
                }
            }
        }

        return normalized;
    }

    private void validateFormulaSpecificRules(String formulaKey, Map<String, Double> dimensions) {
        if ("PIPE_ROUND".equals(formulaKey)) {
            double outsideDiameter = dimensions.get("outside_diameter");
            double wallThickness = dimensions.get("wall_thickness");
            if (wallThickness >= outsideDiameter / 2.0) {
                throw new ValidationException(
                    "Wall thickness must be less than half of the outside diameter.",
                    "wall_thickness"
                );
            }
        }
        if ("PIPE_SQUARE".equals(formulaKey)) {
            double outsideWidth = dimensions.get("outside_width");
            double wallThickness = dimensions.get("wall_thickness");
            if (wallThickness * 2.0 >= outsideWidth) {
                throw new ValidationException(
                    "Wall thickness must be less than half of the outside width.",
                    "wall_thickness"
                );
            }
        }
        if ("PIPE_RECTANGULAR".equals(formulaKey)) {
            double outsideWidth = dimensions.get("outside_width");
            double outsideHeight = dimensions.get("outside_height");
            double wallThickness = dimensions.get("wall_thickness");
            if (wallThickness * 2.0 >= outsideWidth || wallThickness * 2.0 >= outsideHeight) {
                throw new ValidationException(
                    "Wall thickness must be less than half of the outside dimensions.",
                    "wall_thickness"
                );
            }
        }
        if ("ANGLE_EQUAL".equals(formulaKey)) {
            double leg = dimensions.get("leg");
            double thickness = dimensions.get("thickness");
            if (thickness >= leg) {
                throw new ValidationException(
                    "Thickness must be less than the leg length.",
                    "thickness"
                );
            }
        }
        if ("ANGLE_UNEQUAL".equals(formulaKey)) {
            double legA = dimensions.get("leg_a");
            double legB = dimensions.get("leg_b");
            double thickness = dimensions.get("thickness");
            if (thickness >= legA || thickness >= legB) {
                throw new ValidationException(
                    "Thickness must be less than both leg lengths.",
                    "thickness"
                );
            }
        }
        if ("BEAM_I".equals(formulaKey)) {
            double height = dimensions.get("height");
            double flangeThickness = dimensions.get("flange_thickness");
            if (flangeThickness * 2.0 >= height) {
                throw new ValidationException(
                    "Flange thickness must be less than half of the overall height.",
                    "flange_thickness"
                );
            }
        }
        if ("BEAM_T".equals(formulaKey)) {
            double height = dimensions.get("height");
            double flangeThickness = dimensions.get("flange_thickness");
            if (flangeThickness >= height) {
                throw new ValidationException(
                    "Flange thickness must be less than the overall height.",
                    "flange_thickness"
                );
            }
        }
        if ("NUT_HEX".equals(formulaKey)) {
            double innerDiameter = dimensions.get("diameter");
            if (innerDiameter <= 0) {
                throw new ValidationException("Inner diameter must be greater than zero.", "diameter");
            }
            double outerDiameter = innerDiameter * 1.6;
            if (outerDiameter <= innerDiameter) {
                throw new ValidationException(
                    "Derived outer diameter must be greater than inner diameter.",
                    "diameter"
                );
            }
        }
    }

    private Map<String, Double> convertCmToMm(Map<String, Double> dimensionsCm) {
        Map<String, Double> result = new HashMap<>();
        for (var entry : dimensionsCm.entrySet()) {
            result.put(entry.getKey(), entry.getValue() * 10.0);
        }
        return result;
    }

    private String normalizeRequired(String value, String field) {
        if (value == null) {
            throw new ValidationException("Value is required.", field);
        }
        String normalized = value.trim();
        if (normalized.isEmpty()) {
            throw new ValidationException("Value is required.", field);
        }
        return normalized;
    }
}
