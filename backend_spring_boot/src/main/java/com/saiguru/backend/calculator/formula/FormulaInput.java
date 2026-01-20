package com.saiguru.backend.calculator.formula;

import com.saiguru.backend.calculator.model.CalculationMode;

import java.util.Map;

public class FormulaInput {
    private final Map<String, Double> dimensionsCm;
    private final double densityGPerCm3;
    private final double quantityOrWeight;
    private final CalculationMode mode;

    public FormulaInput(Map<String, Double> dimensionsCm, double densityGPerCm3, double quantityOrWeight, CalculationMode mode) {
        this.dimensionsCm = dimensionsCm;
        this.densityGPerCm3 = densityGPerCm3;
        this.quantityOrWeight = quantityOrWeight;
        this.mode = mode;
    }

    public Map<String, Double> getDimensionsCm() {
        return dimensionsCm;
    }

    public double getDensityGPerCm3() {
        return densityGPerCm3;
    }

    public double getQuantityOrWeight() {
        return quantityOrWeight;
    }

    public CalculationMode getMode() {
        return mode;
    }
}
