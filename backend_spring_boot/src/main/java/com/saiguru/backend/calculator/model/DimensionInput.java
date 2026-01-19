package com.saiguru.backend.calculator.model;

public class DimensionInput {
    private String key;
    private Double value;
    private String unit;

    public DimensionInput() {
    }

    public DimensionInput(String key, Double value, String unit) {
        this.key = key;
        this.value = value;
        this.unit = unit;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public Double getValue() {
        return value;
    }

    public void setValue(Double value) {
        this.value = value;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }
}
