package com.saiguru.backend.admin.seed;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SeededProductRepository extends JpaRepository<SeededProduct, Long> {
    boolean existsBySeededTrue();

    long countBySeededTrue();

    long deleteBySeededTrue();

    Optional<SeededProduct> findBySeededTrueAndProductTypeAndDisplayName(String productType, String displayName);

    Optional<SeededProduct> findTopBySeededTrueOrderByCreatedAtDesc();
}
