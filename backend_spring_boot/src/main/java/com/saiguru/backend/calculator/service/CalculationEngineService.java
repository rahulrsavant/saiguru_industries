package com.saiguru.backend.calculator.service;

import com.saiguru.backend.calculator.catalog.CatalogCalculator;
import com.saiguru.backend.calculator.catalog.CatalogField;
import com.saiguru.backend.calculator.catalog.CatalogService;
import com.saiguru.backend.calculator.config.AlloyDensityCatalog;
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

    public CalculationEngineService(CatalogService catalogService, FormulaRegistry formulaRegistry) {
        this.catalogService = catalogService;
        this.formulaRegistry = formulaRegistry;
    }

    public CalculationResult calculate(CalculationRequestV2 request) {
        if (request == null) {
            throw new ValidationException("Request body is required.", "request");
        }

        String calculatorId = normalizeRequired(request.getCalculatorId(), "calculatorId");
        String materialId = normalizeRequired(request.getMaterialId(), "materialId");

        CatalogCalculator calculator = catalogService.getCalculator(calculatorId);
        if (calculator == null) {
            throw new ValidationException("Unsupported calculator: " + calculatorId, "calculatorId");
        }

        Double density = AlloyDensityCatalog.DENSITIES_KG_PER_M3.get(materialId);
        if (density == null) {
            throw new ValidationException("Unsupported material: " + materialId, "materialId");
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
        response.setVolumeM3(RoundingUtil.round(result.getVolumeM3(), ROUNDING_SCALE));
        response.setQuantityRaw(result.getQuantity());
        response.setQuantity(RoundingUtil.round(result.getQuantity(), ROUNDING_SCALE));
        response.setMode(mode);

        if (Boolean.TRUE.equals(request.getDebug())) {
            response.setDensityKgM3(density);
            response.setVolumePerPieceM3(result.getVolumePerPieceM3());
            response.setNormalizedDimensionsMm(normalizedDimensions);
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
            double millimeters;
            try {
                millimeters = UnitConverter.toMillimeters(value, unit);
            } catch (IllegalArgumentException exception) {
                throw new ValidationException(exception.getMessage(), key);
            }
            normalized.put(key, millimeters);
        }

        for (CatalogField field : fields) {
            Double value = normalized.get(field.getKey());
            if (field.isRequired() && (value == null || value <= 0)) {
                throw new ValidationException("Missing or invalid dimension: " + field.getLabel(), field.getKey());
            }
            if (value != null && field.getMinValue() != null && value < field.getMinValue()) {
                throw new ValidationException(
                    "Value for " + field.getLabel() + " must be at least " + field.getMinValue() + ".",
                    field.getKey()
                );
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
