package com.saiguru.backend.calculator.catalog;

import java.util.List;

public class CatalogCalculator {
    private String id;
    private String category;
    private String menuLabel;
    private String subtypeLabel;
    private String formulaKey;
    private List<CatalogField> fields;

    public CatalogCalculator() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getMenuLabel() {
        return menuLabel;
    }

    public void setMenuLabel(String menuLabel) {
        this.menuLabel = menuLabel;
    }

    public String getSubtypeLabel() {
        return subtypeLabel;
    }

    public void setSubtypeLabel(String subtypeLabel) {
        this.subtypeLabel = subtypeLabel;
    }

    public String getFormulaKey() {
        return formulaKey;
    }

    public void setFormulaKey(String formulaKey) {
        this.formulaKey = formulaKey;
    }

    public List<CatalogField> getFields() {
        return fields;
    }

    public void setFields(List<CatalogField> fields) {
        this.fields = fields;
    }
}
