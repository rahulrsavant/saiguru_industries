package com.saiguru.backend.calculator.catalog;

import java.util.List;

public class CatalogResponse {
    private CatalogUnitSystem unitSystem;
    private List<CatalogCalculator> calculators;

    public CatalogResponse() {
    }

    public CatalogUnitSystem getUnitSystem() {
        return unitSystem;
    }

    public void setUnitSystem(CatalogUnitSystem unitSystem) {
        this.unitSystem = unitSystem;
    }

    public List<CatalogCalculator> getCalculators() {
        return calculators;
    }

    public void setCalculators(List<CatalogCalculator> calculators) {
        this.calculators = calculators;
    }
}
