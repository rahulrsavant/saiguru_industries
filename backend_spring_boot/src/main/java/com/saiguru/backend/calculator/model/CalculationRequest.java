package com.saiguru.backend.calculator.model;

import java.util.List;

public class CalculationRequest {
    private String alloy;
    private String shape;
    private Integer pieces;
    private List<DimensionInput> dimensions;
    private Boolean debug;

    public CalculationRequest() {
    }

    public CalculationRequest(String alloy, String shape, Integer pieces, List<DimensionInput> dimensions) {
        this.alloy = alloy;
        this.shape = shape;
        this.pieces = pieces;
        this.dimensions = dimensions;
    }

    public String getAlloy() {
        return alloy;
    }

    public void setAlloy(String alloy) {
        this.alloy = alloy;
    }

    public String getShape() {
        return shape;
    }

    public void setShape(String shape) {
        this.shape = shape;
    }

    public Integer getPieces() {
        return pieces;
    }

    public void setPieces(Integer pieces) {
        this.pieces = pieces;
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
