package com.saiguru.backend.admin.seed;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
class SeedProductServiceTest {
    @Autowired
    private SeedProductService seedProductService;

    @Autowired
    private SeededProductRepository repository;

    @Autowired
    private com.saiguru.backend.estimate.EstimateRepository estimateRepository;

    @Autowired
    private com.saiguru.backend.estimate.EstimateItemRepository estimateItemRepository;

    @BeforeEach
    void cleanup() {
        estimateItemRepository.deleteAll();
        estimateRepository.deleteAll();
        repository.deleteAll();
    }

    @Test
    void seedsProductsIdempotently() {
        SeedProductRequest request = new SeedProductRequest();
        request.setMode("seed");
        SeedAllResponse first = seedProductService.seedProducts(request, "admin");

        assertTrue(first.getProducts().getInserted() > 0);
        assertEquals(first.getProducts().getInserted(), first.getProducts().getItems().size());
        assertEquals(first.getProducts().getInserted(), repository.countBySeededTrue());
        assertTrue(first.getEstimate().getItemsInserted() > 0);

        SeedAllResponse second = seedProductService.seedProducts(request, "admin");
        assertEquals(0, second.getProducts().getInserted());
        assertEquals(first.getProducts().getItems().size(), second.getProducts().getSkipped());
        assertEquals(second.getProducts().getSkipped(), second.getProducts().getItems().size());
        assertTrue(second.getProducts().getErrors().isEmpty());
        assertTrue(second.getProducts().getItems().stream().allMatch(item -> "SKIPPED".equals(item.getStatus())));
        assertEquals(0, second.getEstimate().getItemsInserted());
        assertEquals(first.getProducts().getItems().size(), second.getEstimate().getItemsSkipped());
    }

    @Test
    void reseedDeletesExistingRows() {
        SeedProductRequest seedRequest = new SeedProductRequest();
        seedRequest.setMode("seed");
        SeedAllResponse seed = seedProductService.seedProducts(seedRequest, "admin");
        long existingCount = repository.countBySeededTrue();

        SeedProductRequest reseedRequest = new SeedProductRequest();
        reseedRequest.setMode("reseed");
        SeedAllResponse reseed = seedProductService.seedProducts(reseedRequest, "admin");

        assertEquals(existingCount, reseed.getProducts().getDeleted());
        assertEquals(seed.getProducts().getInserted(), reseed.getProducts().getInserted());
        assertEquals(0, reseed.getProducts().getSkipped());
        assertEquals(reseed.getProducts().getInserted(), repository.countBySeededTrue());
        assertEquals(seed.getEstimate().getItemsInserted(), reseed.getEstimate().getItemsInserted());
        assertTrue(reseed.getEstimate().getItemsDeleted() > 0);
    }
}
