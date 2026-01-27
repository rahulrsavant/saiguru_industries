package com.saiguru.backend.estimate;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface EstimateRepository extends JpaRepository<Estimate, Long> {
    Optional<Estimate> findTopBySeededDemoTrueAndCreatedByOrderByCreatedAtDesc(String createdBy);

    long deleteBySeededDemoTrue();
}
