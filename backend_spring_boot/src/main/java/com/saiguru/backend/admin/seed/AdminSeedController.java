package com.saiguru.backend.admin.seed;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/seed")
public class AdminSeedController {
    private final SeedProductService seedProductService;

    public AdminSeedController(SeedProductService seedProductService) {
        this.seedProductService = seedProductService;
    }

    @PostMapping("/products")
    public ResponseEntity<SeedProductResponse> seedProducts(@RequestBody(required = false) SeedProductRequest request) {
        return ResponseEntity.ok(seedProductService.seedProducts(request));
    }
}
