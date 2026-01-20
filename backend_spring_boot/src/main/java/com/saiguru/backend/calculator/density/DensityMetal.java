package com.saiguru.backend.calculator.density;

import java.util.List;

public class DensityMetal {
    private String id;
    private String label;
    private List<DensityAlloy> alloys;

    public DensityMetal() {
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

    public List<DensityAlloy> getAlloys() {
        return alloys;
    }

    public void setAlloys(List<DensityAlloy> alloys) {
        this.alloys = alloys;
    }
}
