package com.saiguru.backend.calculator.model;

import java.util.List;

public class CalculationRequestV2 {
    private String calculatorId;
    private String materialId;
    private Double piecesOrQty;
    private CalculationMode mode;
    private List<DimensionInput> dimensions;
    private Double densityKgM3;
    private Boolean debug;

    public CalculationRequestV2() {
    }

    public String getCalculatorId() {
        return calculatorId;
    }

    public void setCalculatorId(String calculatorId) {
        this.calculatorId = calculatorId;
    }

    public String getMaterialId() {
        return materialId;
    }

    public void setMaterialId(String materialId) {
        this.materialId = materialId;
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

    public Double getDensityKgM3() {
        return densityKgM3;
    }

    public void setDensityKgM3(Double densityKgM3) {
        this.densityKgM3 = densityKgM3;
    }

    public Boolean getDebug() {
        return debug;
    }

    public void setDebug(Boolean debug) {
        this.debug = debug;
    }
}
