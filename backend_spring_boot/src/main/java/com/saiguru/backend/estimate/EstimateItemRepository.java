package com.saiguru.backend.estimate;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface EstimateItemRepository extends JpaRepository<EstimateItem, Long> {
    Optional<EstimateItem> findByEstimateIdAndProductRefId(Long estimateId, Long productRefId);

    Optional<EstimateItem> findByEstimateIdAndProductTypeAndDisplayName(Long estimateId, String productType, String displayName);

    List<EstimateItem> findByEstimateIdOrderByIdAsc(Long estimateId);

    long deleteBySeededDemoTrue();
}
