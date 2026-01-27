package com.saiguru.backend.admin.seed;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
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
    public ResponseEntity<SeedAllResponse> seedProducts(
        Authentication authentication,
        @RequestBody(required = false) SeedProductRequest request
    ) {
        String username = authentication != null ? authentication.getName() : null;
        return ResponseEntity.ok(seedProductService.seedProducts(request, username));
    }

    @GetMapping("/products/status")
    public ResponseEntity<SeedProductStatusResponse> getSeedStatus() {
        return ResponseEntity.ok(seedProductService.getSeedStatus());
    }
}
