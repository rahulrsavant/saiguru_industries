package com.saiguru.backend.calculator.catalog;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.io.InputStream;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

@Service
public class CatalogService {
    private final CatalogResponse catalog;
    private final Map<String, CatalogCalculator> calculatorLookup;

    public CatalogService(ObjectMapper objectMapper) {
        this.catalog = loadCatalog(objectMapper);
        this.calculatorLookup = catalog.getCalculators().stream()
            .collect(Collectors.toUnmodifiableMap(CatalogCalculator::getId, Function.identity()));
    }

    public CatalogResponse getCatalog() {
        return catalog;
    }

    public CatalogCalculator getCalculator(String calculatorId) {
        return calculatorLookup.get(calculatorId);
    }

    private CatalogResponse loadCatalog(ObjectMapper objectMapper) {
        try (InputStream inputStream = new ClassPathResource("calculator-catalog.json").getInputStream()) {
            return objectMapper.readValue(inputStream, CatalogResponse.class);
        } catch (IOException exception) {
            throw new IllegalStateException("Failed to load calculator catalog.", exception);
        }
    }
}
