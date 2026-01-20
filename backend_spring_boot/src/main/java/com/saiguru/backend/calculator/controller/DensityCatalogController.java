package com.saiguru.backend.calculator.controller;

import com.saiguru.backend.calculator.density.DensityCatalog;
import com.saiguru.backend.calculator.density.DensityCatalogService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DensityCatalogController {
    private final DensityCatalogService densityCatalogService;

    public DensityCatalogController(DensityCatalogService densityCatalogService) {
        this.densityCatalogService = densityCatalogService;
    }

    @GetMapping({"/api/density-catalog", "/density-catalog"})
    public DensityCatalog getCatalog() {
        return densityCatalogService.getCatalog();
    }
}
