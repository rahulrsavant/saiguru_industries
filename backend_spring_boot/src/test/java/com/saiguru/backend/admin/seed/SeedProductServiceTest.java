package com.saiguru.backend.admin.seed;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
class SeedProductServiceTest {
    @Autowired
    private SeedProductService seedProductService;

    @Autowired
    private SeededProductRepository repository;

    @BeforeEach
    void cleanup() {
        repository.deleteAll();
    }

    @Test
    void seedsProductsAndPreventsDuplicateSeed() {
        SeedProductRequest request = new SeedProductRequest();
        request.setMode("seed");
        SeedProductResponse first = seedProductService.seedProducts(request);

        assertTrue(first.getInserted() > 0);
        assertEquals(first.getInserted(), first.getItems().size());
        assertEquals(first.getInserted(), repository.countBySeededTrue());

        SeedProductResponse second = seedProductService.seedProducts(request);
        assertEquals(0, second.getInserted());
        assertTrue(second.getSkipped() > 0);
        assertFalse(second.getErrors().isEmpty());
    }

    @Test
    void reseedDeletesExistingRows() {
        SeedProductRequest seedRequest = new SeedProductRequest();
        seedRequest.setMode("seed");
        SeedProductResponse seed = seedProductService.seedProducts(seedRequest);
        long existingCount = repository.countBySeededTrue();

        SeedProductRequest reseedRequest = new SeedProductRequest();
        reseedRequest.setMode("reseed");
        SeedProductResponse reseed = seedProductService.seedProducts(reseedRequest);

        assertEquals(existingCount, reseed.getDeleted());
        assertEquals(seed.getInserted(), reseed.getInserted());
        assertEquals(reseed.getInserted(), repository.countBySeededTrue());
    }
}
