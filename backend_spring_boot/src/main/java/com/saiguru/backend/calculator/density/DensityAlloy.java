package com.saiguru.backend.calculator.density;

public class DensityAlloy {
    private String id;
    private String label;
    private Double density;

    public DensityAlloy() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public Double getDensity() {
        return density;
    }

    public void setDensity(Double density) {
        this.density = density;
    }
}
