package com.saiguru.backend.admin.seed;

public class SeedEstimateSummary {
    private Long estimateId;
    private String estimateNo;
    private int itemsInserted;
    private int itemsSkipped;
    private int itemsDeleted;

    public SeedEstimateSummary() {
    }

    public Long getEstimateId() {
        return estimateId;
    }

    public void setEstimateId(Long estimateId) {
        this.estimateId = estimateId;
    }

    public String getEstimateNo() {
        return estimateNo;
    }

    public void setEstimateNo(String estimateNo) {
        this.estimateNo = estimateNo;
    }

    public int getItemsInserted() {
        return itemsInserted;
    }

    public void setItemsInserted(int itemsInserted) {
        this.itemsInserted = itemsInserted;
    }

    public int getItemsSkipped() {
        return itemsSkipped;
    }

    public void setItemsSkipped(int itemsSkipped) {
        this.itemsSkipped = itemsSkipped;
    }

    public int getItemsDeleted() {
        return itemsDeleted;
    }

    public void setItemsDeleted(int itemsDeleted) {
        this.itemsDeleted = itemsDeleted;
    }
}
