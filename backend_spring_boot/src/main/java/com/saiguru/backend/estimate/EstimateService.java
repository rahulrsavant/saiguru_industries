package com.saiguru.backend.estimate;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.saiguru.backend.calculator.catalog.CatalogCalculator;
import com.saiguru.backend.calculator.catalog.CatalogResponse;
import com.saiguru.backend.calculator.catalog.CatalogService;
import com.saiguru.backend.calculator.density.DensityAlloy;
import com.saiguru.backend.calculator.density.DensityCatalog;
import com.saiguru.backend.calculator.density.DensityCatalogService;
import com.saiguru.backend.calculator.density.DensityMetal;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;

@Service
public class EstimateService {
    private final EstimateRepository estimateRepository;
    private final EstimateItemRepository estimateItemRepository;
    private final CatalogService catalogService;
    private final DensityCatalogService densityCatalogService;
    private final ObjectMapper objectMapper;

    public EstimateService(
        EstimateRepository estimateRepository,
        EstimateItemRepository estimateItemRepository,
        CatalogService catalogService,
        DensityCatalogService densityCatalogService,
        ObjectMapper objectMapper
    ) {
        this.estimateRepository = estimateRepository;
        this.estimateItemRepository = estimateItemRepository;
        this.catalogService = catalogService;
        this.densityCatalogService = densityCatalogService;
        this.objectMapper = objectMapper;
    }

    public Optional<EstimateSessionResponse> getCurrentSeededEstimate(String createdBy) {
        if (createdBy == null || createdBy.isBlank()) {
            return Optional.empty();
        }
        Optional<Estimate> estimate = estimateRepository.findTopBySeededDemoTrueAndCreatedByOrderByCreatedAtDesc(createdBy);
        return estimate.map(this::buildSessionResponse);
    }

    private EstimateSessionResponse buildSessionResponse(Estimate estimate) {
        CatalogResponse catalog = catalogService.getCatalog();
        Map<String, CatalogCalculator> calculatorLookup = new HashMap<>();
        if (catalog.getCalculators() != null) {
            for (CatalogCalculator calculator : catalog.getCalculators()) {
                calculatorLookup.put(calculator.getId(), calculator);
            }
        }

        DensityCatalog densityCatalog = densityCatalogService.getCatalog();
        Map<String, DensityMetal> metalLookup = new HashMap<>();
        Map<String, DensityAlloy> alloyLookup = new HashMap<>();
        if (densityCatalog.getMetals() != null) {
            for (DensityMetal metal : densityCatalog.getMetals()) {
                metalLookup.put(metal.getId(), metal);
                if (metal.getAlloys() != null) {
                    for (DensityAlloy alloy : metal.getAlloys()) {
                        alloyLookup.put(alloy.getId(), alloy);
                    }
                }
            }
        }

        List<EstimateItem> items = estimateItemRepository.findByEstimateIdOrderByIdAsc(estimate.getId());
        EstimateSessionResponse response = new EstimateSessionResponse();
        response.setEstimateId(estimate.getId());
        response.setEstimateNo(estimate.getEstimateNo());
        response.setCreatedAt(estimate.getCreatedAt());
        response.setUpdatedAt(estimate.getUpdatedAt());

        EstimateSessionResponse.EstimateCustomer customer = new EstimateSessionResponse.EstimateCustomer();
        customer.setName(estimate.getCustomerName());
        customer.setBusinessName(estimate.getBusinessName());
        customer.setMobile(estimate.getMobile());
        customer.setEmail(estimate.getEmail());
        response.setCustomer(customer);

        BigDecimal totalWeight = BigDecimal.ZERO;
        for (EstimateItem item : items) {
            EstimateSessionResponse.EstimateItemResponse itemResponse = new EstimateSessionResponse.EstimateItemResponse();
            itemResponse.setLineId("seed_" + item.getId());
            itemResponse.setEstimateNo(estimate.getEstimateNo());
            itemResponse.setPieces(item.getPieces());
            itemResponse.setMode(item.getMode());
            itemResponse.setUnitSystem(item.getUnitSystem());
            itemResponse.setCreatedAt(item.getCreatedAt());

            CatalogCalculator calculator = calculatorLookup.get(item.getShapeCalculatorId());
            String shapeLabel = item.getShapeCalculatorId();
            if (calculator != null) {
                if (calculator.getSubtypeLabel() != null && !calculator.getSubtypeLabel().isBlank()) {
                    shapeLabel = calculator.getMenuLabel() + " - " + calculator.getSubtypeLabel();
                } else {
                    shapeLabel = calculator.getMenuLabel();
                }
            }
            itemResponse.setShape(new EstimateSessionResponse.IdLabel(item.getShapeCalculatorId(), shapeLabel));

            DensityMetal metal = metalLookup.get(item.getMetalId());
            String metalLabel = metal != null ? metal.getLabel() : item.getMetalId();
            itemResponse.setMetal(new EstimateSessionResponse.IdLabel(item.getMetalId(), metalLabel));

            DensityAlloy alloy = alloyLookup.get(item.getAlloyId());
            String alloyLabel = alloy != null ? alloy.getLabel() : item.getAlloyId();
            itemResponse.setAlloy(new EstimateSessionResponse.IdLabel(item.getAlloyId(), alloyLabel));

            Map<String, EstimateSessionResponse.DimensionValue> dimensions = readDimensions(item.getDimensionsJson());
            itemResponse.setDimensions(dimensions);

            Double weightKg = item.getResultKg() != null ? item.getResultKg().doubleValue() : null;
            itemResponse.setCalculation(new EstimateSessionResponse.EstimateCalculation(weightKg));
            if (item.getResultKg() != null) {
                totalWeight = totalWeight.add(item.getResultKg());
            }

            response.getItems().add(itemResponse);
        }

        EstimateSessionResponse.EstimateTotals totals = new EstimateSessionResponse.EstimateTotals();
        totals.setTotalWeightKg(totalWeight.doubleValue());
        response.setTotals(totals);

        return response;
    }

    private Map<String, EstimateSessionResponse.DimensionValue> readDimensions(String json) {
        if (json == null || json.isBlank()) {
            return Map.of();
        }
        try {
            return objectMapper.readValue(json, new TypeReference<Map<String, EstimateSessionResponse.DimensionValue>>() {});
        } catch (Exception exception) {
            return Map.of();
        }
    }
}
