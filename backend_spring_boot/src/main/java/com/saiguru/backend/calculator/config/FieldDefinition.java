package com.saiguru.backend.calculator.config;

public class FieldDefinition {
    private final String key;
    private final String label;
    private final String defaultUnit;

    public FieldDefinition(String key, String label, String defaultUnit) {
        this.key = key;
        this.label = label;
        this.defaultUnit = defaultUnit;
    }

    public String getKey() {
        return key;
    }

    public String getLabel() {
        return label;
    }

    public String getDefaultUnit() {
        return defaultUnit;
    }
}
