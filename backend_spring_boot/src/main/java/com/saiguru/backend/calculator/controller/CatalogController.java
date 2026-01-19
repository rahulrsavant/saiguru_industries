package com.saiguru.backend.calculator.controller;

import com.saiguru.backend.calculator.catalog.CatalogResponse;
import com.saiguru.backend.calculator.catalog.CatalogService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CatalogController {
    private final CatalogService catalogService;

    public CatalogController(CatalogService catalogService) {
        this.catalogService = catalogService;
    }

    @GetMapping({"/api/catalog", "/catalog"})
    public CatalogResponse getCatalog() {
        return catalogService.getCatalog();
    }
}
