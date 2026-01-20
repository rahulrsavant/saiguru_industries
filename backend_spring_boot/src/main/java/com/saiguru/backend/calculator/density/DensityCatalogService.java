package com.saiguru.backend.calculator.density;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.io.InputStream;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

@Service
public class DensityCatalogService {
    private final DensityCatalog catalog;
    private final Map<String, DensityMetal> metalLookup;

    public DensityCatalogService(ObjectMapper objectMapper) {
        this.catalog = loadCatalog(objectMapper);
        this.metalLookup = catalog.getMetals().stream()
            .collect(Collectors.toUnmodifiableMap(DensityMetal::getId, Function.identity()));
    }

    public DensityCatalog getCatalog() {
        return catalog;
    }

    public Double getDensity(String metalId, String alloyId) {
        if (metalId == null || alloyId == null) {
            return null;
        }
        DensityMetal metal = metalLookup.get(metalId);
        if (metal == null || metal.getAlloys() == null) {
            return null;
        }
        return metal.getAlloys().stream()
            .filter(alloy -> alloyId.equals(alloy.getId()))
            .map(DensityAlloy::getDensity)
            .findFirst()
            .orElse(null);
    }

    private DensityCatalog loadCatalog(ObjectMapper objectMapper) {
        try (InputStream inputStream = new ClassPathResource("density-catalog.json").getInputStream()) {
            return objectMapper.readValue(inputStream, DensityCatalog.class);
        } catch (IOException exception) {
            throw new IllegalStateException("Failed to load density catalog.", exception);
        }
    }
}
