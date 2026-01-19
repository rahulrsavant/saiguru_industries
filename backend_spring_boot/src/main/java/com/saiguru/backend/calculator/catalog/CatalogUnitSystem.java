package com.saiguru.backend.calculator.catalog;

public class CatalogUnitSystem {
    private String lengthBase;
    private String volumeBase;
    private String densityBase;
    private String weightBase;

    public CatalogUnitSystem() {
    }

    public String getLengthBase() {
        return lengthBase;
    }

    public void setLengthBase(String lengthBase) {
        this.lengthBase = lengthBase;
    }

    public String getVolumeBase() {
        return volumeBase;
    }

    public void setVolumeBase(String volumeBase) {
        this.volumeBase = volumeBase;
    }

    public String getDensityBase() {
        return densityBase;
    }

    public void setDensityBase(String densityBase) {
        this.densityBase = densityBase;
    }

    public String getWeightBase() {
        return weightBase;
    }

    public void setWeightBase(String weightBase) {
        this.weightBase = weightBase;
    }
}
