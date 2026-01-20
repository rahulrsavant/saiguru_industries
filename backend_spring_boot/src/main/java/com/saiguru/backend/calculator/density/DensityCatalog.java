package com.saiguru.backend.calculator.density;

import java.util.List;

public class DensityCatalog {
    private String unit;
    private List<DensityMetal> metals;

    public DensityCatalog() {
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public List<DensityMetal> getMetals() {
        return metals;
    }

    public void setMetals(List<DensityMetal> metals) {
        this.metals = metals;
    }
}
