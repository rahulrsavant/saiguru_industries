package com.saiguru.backend.admin.seed;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SeededProductRepository extends JpaRepository<SeededProduct, Long> {
    boolean existsBySeededTrue();

    long countBySeededTrue();

    long deleteBySeededTrue();
}
