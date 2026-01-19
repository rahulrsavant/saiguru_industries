package com.saiguru.backend.calculator.catalog;

import java.util.List;

public class CatalogField {
    private String key;
    private String label;
    private String unitType;
    private List<String> allowedUnits;
    private String defaultUnit;
    private boolean required;
    private Double minValue;

    public CatalogField() {
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getUnitType() {
        return unitType;
    }

    public void setUnitType(String unitType) {
        this.unitType = unitType;
    }

    public List<String> getAllowedUnits() {
        return allowedUnits;
    }

    public void setAllowedUnits(List<String> allowedUnits) {
        this.allowedUnits = allowedUnits;
    }

    public String getDefaultUnit() {
        return defaultUnit;
    }

    public void setDefaultUnit(String defaultUnit) {
        this.defaultUnit = defaultUnit;
    }

    public boolean isRequired() {
        return required;
    }

    public void setRequired(boolean required) {
        this.required = required;
    }

    public Double getMinValue() {
        return minValue;
    }

    public void setMinValue(Double minValue) {
        this.minValue = minValue;
    }
}
