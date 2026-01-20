package com.saiguru.backend.calculator.model;

import java.util.List;

public class CalculationRequestV2 {
    private String calculatorId;
    private String metal;
    private String alloy;
    private Double piecesOrQty;
    private CalculationMode mode;
    private List<DimensionInput> dimensions;
    private Boolean debug;

    public CalculationRequestV2() {
    }

    public String getCalculatorId() {
        return calculatorId;
    }

    public void setCalculatorId(String calculatorId) {
        this.calculatorId = calculatorId;
    }

    public String getMetal() {
        return metal;
    }

    public void setMetal(String metal) {
        this.metal = metal;
    }

    public String getAlloy() {
        return alloy;
    }

    public void setAlloy(String alloy) {
        this.alloy = alloy;
    }

    public Double getPiecesOrQty() {
        return piecesOrQty;
    }

    public void setPiecesOrQty(Double piecesOrQty) {
        this.piecesOrQty = piecesOrQty;
    }

    public CalculationMode getMode() {
        return mode;
    }

    public void setMode(CalculationMode mode) {
        this.mode = mode;
    }

    public List<DimensionInput> getDimensions() {
        return dimensions;
    }

    public void setDimensions(List<DimensionInput> dimensions) {
        this.dimensions = dimensions;
    }

    public Boolean getDebug() {
        return debug;
    }

    public void setDebug(Boolean debug) {
        this.debug = debug;
    }
}
