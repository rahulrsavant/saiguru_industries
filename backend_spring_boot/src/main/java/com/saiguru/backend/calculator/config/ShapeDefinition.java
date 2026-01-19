package com.saiguru.backend.calculator.config;

import java.util.List;

public class ShapeDefinition {
    private final List<FieldDefinition> fields;
    private final VolumeFormula volumeFormula;

    public ShapeDefinition(List<FieldDefinition> fields, VolumeFormula volumeFormula) {
        this.fields = fields;
        this.volumeFormula = volumeFormula;
    }

    public List<FieldDefinition> getFields() {
        return fields;
    }

    public VolumeFormula getVolumeFormula() {
        return volumeFormula;
    }
}
