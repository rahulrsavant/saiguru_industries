package com.saiguru.backend.calculator.formula;

import com.saiguru.backend.calculator.model.CalculationMode;

import java.util.Map;

public class FormulaInput {
    private final Map<String, Double> dimensionsMm;
    private final double densityKgM3;
    private final double quantityOrWeight;
    private final CalculationMode mode;

    public FormulaInput(Map<String, Double> dimensionsMm, double densityKgM3, double quantityOrWeight, CalculationMode mode) {
        this.dimensionsMm = dimensionsMm;
        this.densityKgM3 = densityKgM3;
        this.quantityOrWeight = quantityOrWeight;
        this.mode = mode;
    }

    public Map<String, Double> getDimensionsMm() {
        return dimensionsMm;
    }

    public double getDensityKgM3() {
        return densityKgM3;
    }

    public double getQuantityOrWeight() {
        return quantityOrWeight;
    }

    public CalculationMode getMode() {
        return mode;
    }
}
