package com.saiguru.backend.admin.seed;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.saiguru.backend.calculator.model.CalculationMode;
import com.saiguru.backend.calculator.model.CalculationRequestV2;
import com.saiguru.backend.calculator.model.DimensionInput;
import com.saiguru.backend.calculator.service.CalculationEngineService;
import com.saiguru.backend.estimate.Estimate;
import com.saiguru.backend.estimate.EstimateItem;
import com.saiguru.backend.estimate.EstimateItemRepository;
import com.saiguru.backend.estimate.EstimateRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SeedProductService {
    private static final String SEEDER_USER = "SYSTEM_SEEDER";
    private static final String MODE_SEED = "seed";
    private static final String MODE_RESEED = "reseed";

    private final SeededProductRepository repository;
    private final EstimateRepository estimateRepository;
    private final EstimateItemRepository estimateItemRepository;
    private final CalculationEngineService calculationEngineService;
    private final ObjectMapper objectMapper;

    public SeedProductService(
        SeededProductRepository repository,
        EstimateRepository estimateRepository,
        EstimateItemRepository estimateItemRepository,
        CalculationEngineService calculationEngineService,
        ObjectMapper objectMapper
    ) {
        this.repository = repository;
        this.estimateRepository = estimateRepository;
        this.estimateItemRepository = estimateItemRepository;
        this.calculationEngineService = calculationEngineService;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public SeedAllResponse seedProducts(SeedProductRequest request, String username) {
        String mode = request != null ? request.getMode() : null;
        if (mode == null || mode.isBlank()) {
            mode = MODE_SEED;
        }
        mode = mode.toLowerCase(Locale.ROOT);

        String batchId = resolveBatchId(request);
        SeedProductResponse response = new SeedProductResponse();
        response.setBatchId(batchId);

        if (!MODE_SEED.equals(mode) && !MODE_RESEED.equals(mode)) {
            response.getErrors().add("Mode must be seed or reseed.");
            SeedAllResponse wrapper = new SeedAllResponse();
            wrapper.setBatchId(batchId);
            wrapper.setProducts(response);
            wrapper.setMessage("Invalid mode.");
            return wrapper;
        }

        if (MODE_RESEED.equals(mode)) {
            int deleted = Math.toIntExact(repository.deleteBySeededTrue());
            response.setDeleted(deleted);
        }

        List<SeedDefinition> definitions = buildSeedDefinitions();
        int inserted = 0;
        int skipped = 0;
        Map<String, SeededProduct> seededLookup = new LinkedHashMap<>();
        for (SeedDefinition definition : definitions) {
            try {
                if (MODE_SEED.equals(mode)) {
                    Optional<SeededProduct> existing = repository.findBySeededTrueAndProductTypeAndDisplayName(
                        definition.productType,
                        definition.displayName
                    );
                    if (existing.isPresent()) {
                        seededLookup.put(definition.productType + "|" + definition.displayName, existing.get());
                        skipped += 1;
                        response.getItems().add(new SeedProductResult(
                            definition.productType,
                            definition.displayName,
                            String.valueOf(existing.get().getId()),
                            null,
                            "SKIPPED",
                            null
                        ));
                        continue;
                    }
                }
                double weightKg = calculateWeight(definition);
                SeededProduct entity = new SeededProduct();
                entity.setProductType(definition.productType);
                entity.setDisplayName(definition.displayName);
                entity.setCalculatorId(definition.calculatorId);
                entity.setMetalId(definition.metalId);
                entity.setAlloyId(definition.alloyId);
                entity.setDimensionsJson(writeDimensions(definition.dimensions));
                entity.setPricePerKg(definition.pricePerKg);
                entity.setCreatedBy(SEEDER_USER);
                entity.setSeeded(true);
                entity.setSeedBatchId(response.getBatchId());
                entity.setCreatedAt(Instant.now());
                SeededProduct saved = repository.save(entity);
                seededLookup.put(definition.productType + "|" + definition.displayName, saved);
                inserted += 1;
                response.getItems().add(new SeedProductResult(
                    definition.productType,
                    definition.displayName,
                    String.valueOf(saved.getId()),
                    weightKg,
                    "INSERTED",
                    null
                ));
            } catch (Exception exception) {
                response.getItems().add(new SeedProductResult(
                    definition.productType,
                    definition.displayName,
                    null,
                    null,
                    "FAILED",
                    exception.getMessage()
                ));
                response.getErrors().add(definition.displayName + ": " + exception.getMessage());
            }
        }

        response.setInserted(inserted);
        response.setSkipped(skipped);
        SeedEstimateSummary estimateSummary = seedDemoEstimate(username, mode, batchId, definitions, seededLookup);

        SeedAllResponse wrapper = new SeedAllResponse();
        wrapper.setBatchId(batchId);
        wrapper.setProducts(response);
        wrapper.setEstimate(estimateSummary);
        wrapper.setMessage(response.getErrors().isEmpty() ? "Seed completed." : "Seed completed with errors.");
        return wrapper;
    }

    public SeedProductStatusResponse getSeedStatus() {
        SeedProductStatusResponse response = new SeedProductStatusResponse();
        response.setTotalSeededCount(repository.countBySeededTrue());
        repository.findTopBySeededTrueOrderByCreatedAtDesc().ifPresent((latest) -> {
            response.setLastBatchId(latest.getSeedBatchId());
            response.setLastSeededAt(latest.getCreatedAt());
        });
        return response;
    }

    private double calculateWeight(SeedDefinition definition) {
        CalculationRequestV2 request = new CalculationRequestV2();
        request.setCalculatorId(definition.calculatorId);
        request.setMetal(definition.metalId);
        request.setAlloy(definition.alloyId);
        request.setPiecesOrQty(definition.pieces);
        request.setMode(CalculationMode.QTY_TO_WEIGHT);
        request.setDimensions(definition.dimensions);
        var result = calculationEngineService.calculate(request);
        return result.getWeightKg();
    }

    private String resolveBatchId(SeedProductRequest request) {
        if (request != null && request.getBatchId() != null && !request.getBatchId().isBlank()) {
            return request.getBatchId();
        }
        return "seed-" + Instant.now().toEpochMilli();
    }

    private String writeDimensions(List<DimensionInput> dimensions) {
        try {
            return objectMapper.writeValueAsString(dimensions);
        } catch (JsonProcessingException exception) {
            throw new IllegalStateException("Unable to serialize dimensions.", exception);
        }
    }

    private SeedEstimateSummary seedDemoEstimate(
        String username,
        String mode,
        String batchId,
        List<SeedDefinition> definitions,
        Map<String, SeededProduct> productLookup
    ) {
        SeedEstimateSummary summary = new SeedEstimateSummary();
        String owner = (username == null || username.isBlank()) ? "system" : username;

        if (MODE_RESEED.equals(mode)) {
            int deletedItems = Math.toIntExact(estimateItemRepository.deleteBySeededDemoTrue());
            estimateRepository.deleteBySeededDemoTrue();
            summary.setItemsDeleted(deletedItems);
        }

        Estimate estimate = estimateRepository.findTopBySeededDemoTrueAndCreatedByOrderByCreatedAtDesc(owner).orElse(null);
        if (estimate == null) {
            estimate = new Estimate();
            estimate.setEstimateNo(buildEstimateNo());
            estimate.setCustomerName("Test Customer");
            estimate.setBusinessName("Test Business");
            estimate.setMobile("9999999999");
            estimate.setEmail("test@example.com");
            estimate.setCreatedBy(owner);
            estimate.setSeededDemo(true);
            estimate = estimateRepository.save(estimate);
        }

        summary.setEstimateId(estimate.getId());
        summary.setEstimateNo(estimate.getEstimateNo());

        int itemsInserted = 0;
        int itemsSkipped = 0;
        for (SeedDefinition definition : definitions) {
            SeededProduct seededProduct = productLookup.get(definition.productType + "|" + definition.displayName);
            Optional<EstimateItem> existing = Optional.empty();
            if (seededProduct != null) {
                existing = estimateItemRepository.findByEstimateIdAndProductRefId(estimate.getId(), seededProduct.getId());
            }
            if (existing.isEmpty()) {
                existing = estimateItemRepository.findByEstimateIdAndProductTypeAndDisplayName(
                    estimate.getId(),
                    definition.productType,
                    definition.displayName
                );
            }
            if (existing.isPresent()) {
                itemsSkipped += 1;
                continue;
            }

            double weightKg = calculateWeight(definition);
            EstimateItem item = new EstimateItem();
            item.setEstimate(estimate);
            item.setProductType(definition.productType);
            item.setDisplayName(definition.displayName);
            item.setShapeCalculatorId(definition.calculatorId);
            item.setMetalId(definition.metalId);
            item.setAlloyId(definition.alloyId);
            item.setPieces(definition.pieces.intValue());
            item.setMode(CalculationMode.QTY_TO_WEIGHT.name());
            item.setUnitSystem(inferUnitSystem(definition.dimensions));
            item.setDimensionsJson(writeDimensionMap(definition.dimensions));
            item.setResultKg(BigDecimal.valueOf(weightKg).setScale(3, RoundingMode.HALF_UP));
            item.setProductRefId(seededProduct != null ? seededProduct.getId() : null);
            item.setSeededDemo(true);
            estimateItemRepository.save(item);
            itemsInserted += 1;
        }

        summary.setItemsInserted(itemsInserted);
        summary.setItemsSkipped(itemsSkipped);
        return summary;
    }

    private String writeDimensionMap(List<DimensionInput> dimensions) {
        Map<String, Map<String, Object>> map = new LinkedHashMap<>();
        for (DimensionInput input : dimensions) {
            Map<String, Object> value = new LinkedHashMap<>();
            value.put("value", input.getValue());
            value.put("unit", input.getUnit());
            map.put(input.getKey(), value);
        }
        try {
            return objectMapper.writeValueAsString(map);
        } catch (JsonProcessingException exception) {
            throw new IllegalStateException("Unable to serialize dimensions.", exception);
        }
    }

    private String inferUnitSystem(List<DimensionInput> dimensions) {
        for (DimensionInput input : dimensions) {
            String unit = input.getUnit();
            if (unit == null) continue;
            String normalized = unit.toLowerCase(Locale.ROOT);
            if ("in".equals(normalized) || "ft".equals(normalized)) {
                return "imperial";
            }
        }
        return "metric";
    }

    private String buildEstimateNo() {
        Instant now = Instant.now();
        String date = DateTimeFormatter.ofPattern("ddMMyyyy")
            .withZone(ZoneId.of("Asia/Kolkata"))
            .format(now);
        long timestamp = now.toEpochMilli();
        return "SI" + date + timestamp + "/00001";
    }

    private List<SeedDefinition> buildSeedDefinitions() {
        List<SeedDefinition> definitions = new ArrayList<>();

        definitions.add(new SeedDefinition(
            "angle_equal",
            "Equal Angle 50x50x5 mm",
            "rolled_angle_equal",
            "steel",
            "carbon",
            List.of(
                new DimensionInput("leg", 50.0, "mm"),
                new DimensionInput("thickness", 5.0, "mm"),
                new DimensionInput("length", 1000.0, "mm")
            ),
            new BigDecimal("78.50")
        ));

        definitions.add(new SeedDefinition(
            "angle_equal",
            "Equal Angle 2x2x0.25 in",
            "rolled_angle_equal",
            "stainless_steel",
            "300",
            List.of(
                new DimensionInput("leg", 2.0, "in"),
                new DimensionInput("thickness", 0.25, "in"),
                new DimensionInput("length", 36.0, "in")
            ),
            new BigDecimal("220.00")
        ));

        definitions.add(new SeedDefinition(
            "angle_unequal",
            "Unequal Angle 75x50x6 mm",
            "rolled_angle_unequal",
            "steel",
            "carbon",
            List.of(
                new DimensionInput("leg_a", 75.0, "mm"),
                new DimensionInput("leg_b", 50.0, "mm"),
                new DimensionInput("thickness", 6.0, "mm"),
                new DimensionInput("length", 1000.0, "mm")
            ),
            new BigDecimal("78.50")
        ));

        definitions.add(new SeedDefinition(
            "angle_unequal",
            "Unequal Angle 3x2x0.25 in",
            "rolled_angle_unequal",
            "stainless_steel",
            "300",
            List.of(
                new DimensionInput("leg_a", 3.0, "in"),
                new DimensionInput("leg_b", 2.0, "in"),
                new DimensionInput("thickness", 0.25, "in"),
                new DimensionInput("length", 48.0, "in")
            ),
            new BigDecimal("220.00")
        ));

        definitions.add(new SeedDefinition(
            "rebar",
            "Rebar 12 mm x 6 m",
            "rolled_rebar",
            "steel",
            "carbon",
            List.of(
                new DimensionInput("diameter", 12.0, "mm"),
                new DimensionInput("length", 6000.0, "mm")
            ),
            new BigDecimal("72.00")
        ));

        definitions.add(new SeedDefinition(
            "rebar",
            "Rebar 0.5 in x 10 ft",
            "rolled_rebar",
            "steel",
            "carbon",
            List.of(
                new DimensionInput("diameter", 0.5, "in"),
                new DimensionInput("length", 120.0, "in")
            ),
            new BigDecimal("72.00")
        ));

        definitions.add(new SeedDefinition(
            "beam",
            "I-Beam 200x100x6x10 mm",
            "rolled_beam_i",
            "steel",
            "carbon",
            List.of(
                new DimensionInput("height", 200.0, "mm"),
                new DimensionInput("flange_width", 100.0, "mm"),
                new DimensionInput("web_thickness", 6.0, "mm"),
                new DimensionInput("flange_thickness", 10.0, "mm"),
                new DimensionInput("length", 6000.0, "mm")
            ),
            new BigDecimal("82.00")
        ));

        definitions.add(new SeedDefinition(
            "beam",
            "I-Beam 8x4x0.25x0.5 in",
            "rolled_beam_i",
            "steel",
            "carbon",
            List.of(
                new DimensionInput("height", 8.0, "in"),
                new DimensionInput("flange_width", 4.0, "in"),
                new DimensionInput("web_thickness", 0.25, "in"),
                new DimensionInput("flange_thickness", 0.5, "in"),
                new DimensionInput("length", 96.0, "in")
            ),
            new BigDecimal("82.00")
        ));

        definitions.add(new SeedDefinition(
            "channel",
            "Channel 150x60x6x8 mm",
            "rolled_channel_c",
            "steel",
            "carbon",
            List.of(
                new DimensionInput("height", 150.0, "mm"),
                new DimensionInput("flange_width", 60.0, "mm"),
                new DimensionInput("web_thickness", 6.0, "mm"),
                new DimensionInput("flange_thickness", 8.0, "mm"),
                new DimensionInput("length", 6000.0, "mm")
            ),
            new BigDecimal("80.00")
        ));

        definitions.add(new SeedDefinition(
            "channel",
            "Channel 6x2.5x0.25x0.31 in",
            "rolled_channel_c",
            "steel",
            "carbon",
            List.of(
                new DimensionInput("height", 6.0, "in"),
                new DimensionInput("flange_width", 2.5, "in"),
                new DimensionInput("web_thickness", 0.25, "in"),
                new DimensionInput("flange_thickness", 0.31, "in"),
                new DimensionInput("length", 96.0, "in")
            ),
            new BigDecimal("80.00")
        ));

        definitions.add(new SeedDefinition(
            "flat_bar",
            "Flat Bar 50x6 mm",
            "rolled_flat_bar",
            "steel",
            "carbon",
            List.of(
                new DimensionInput("width", 50.0, "mm"),
                new DimensionInput("thickness", 6.0, "mm"),
                new DimensionInput("length", 6000.0, "mm")
            ),
            new BigDecimal("75.00")
        ));

        definitions.add(new SeedDefinition(
            "flat_bar",
            "Flat Bar 2x0.25 in",
            "rolled_flat_bar",
            "steel",
            "carbon",
            List.of(
                new DimensionInput("width", 2.0, "in"),
                new DimensionInput("thickness", 0.25, "in"),
                new DimensionInput("length", 96.0, "in")
            ),
            new BigDecimal("75.00")
        ));

        definitions.add(new SeedDefinition(
            "sheet",
            "Sheet 1000x2000x3 mm",
            "rolled_sheet",
            "aluminum",
            "6061",
            List.of(
                new DimensionInput("width", 1000.0, "mm"),
                new DimensionInput("length", 2000.0, "mm"),
                new DimensionInput("thickness", 3.0, "mm")
            ),
            new BigDecimal("285.00")
        ));

        definitions.add(new SeedDefinition(
            "sheet",
            "Sheet 36x72x0.125 in",
            "rolled_sheet",
            "aluminum",
            "6061",
            List.of(
                new DimensionInput("width", 36.0, "in"),
                new DimensionInput("length", 72.0, "in"),
                new DimensionInput("thickness", 0.125, "in")
            ),
            new BigDecimal("285.00")
        ));

        definitions.add(new SeedDefinition(
            "square_bar",
            "Square Bar 25 mm",
            "rolled_square_bar",
            "steel",
            "carbon",
            List.of(
                new DimensionInput("width", 25.0, "mm"),
                new DimensionInput("length", 6000.0, "mm")
            ),
            new BigDecimal("78.00")
        ));

        definitions.add(new SeedDefinition(
            "square_bar",
            "Square Bar 1 in",
            "rolled_square_bar",
            "steel",
            "carbon",
            List.of(
                new DimensionInput("width", 1.0, "in"),
                new DimensionInput("length", 72.0, "in")
            ),
            new BigDecimal("78.00")
        ));

        definitions.add(new SeedDefinition(
            "round_bar",
            "Round Bar 20 mm",
            "rolled_round_bar",
            "steel",
            "carbon",
            List.of(
                new DimensionInput("diameter", 20.0, "mm"),
                new DimensionInput("length", 6000.0, "mm")
            ),
            new BigDecimal("78.00")
        ));

        definitions.add(new SeedDefinition(
            "round_bar",
            "Round Bar 1.5 in",
            "rolled_round_bar",
            "steel",
            "carbon",
            List.of(
                new DimensionInput("diameter", 1.5, "in"),
                new DimensionInput("length", 72.0, "in")
            ),
            new BigDecimal("78.00")
        ));

        definitions.add(new SeedDefinition(
            "bolt",
            "Hex Bolt M12 x 50 mm",
            "fastener_bolt_hex",
            "stainless_steel",
            "300",
            List.of(
                new DimensionInput("diameter", 12.0, "mm"),
                new DimensionInput("length", 50.0, "mm")
            ),
            new BigDecimal("240.00")
        ));

        definitions.add(new SeedDefinition(
            "bolt",
            "Hex Bolt 0.5 x 2 in",
            "fastener_bolt_hex",
            "stainless_steel",
            "300",
            List.of(
                new DimensionInput("diameter", 0.5, "in"),
                new DimensionInput("length", 2.0, "in")
            ),
            new BigDecimal("240.00")
        ));

        definitions.add(new SeedDefinition(
            "screw",
            "Machine Screw M6 x 25 mm",
            "fastener_screw_machine",
            "stainless_steel",
            "300",
            List.of(
                new DimensionInput("diameter", 6.0, "mm"),
                new DimensionInput("length", 25.0, "mm")
            ),
            new BigDecimal("260.00")
        ));

        definitions.add(new SeedDefinition(
            "screw",
            "Machine Screw 0.25 x 1 in",
            "fastener_screw_machine",
            "stainless_steel",
            "300",
            List.of(
                new DimensionInput("diameter", 0.25, "in"),
                new DimensionInput("length", 1.0, "in")
            ),
            new BigDecimal("260.00")
        ));

        definitions.add(new SeedDefinition(
            "nut",
            "Hex Nut M12",
            "fastener_nut_hex",
            "stainless_steel",
            "300",
            List.of(
                new DimensionInput("diameter", 12.0, "mm"),
                new DimensionInput("thickness", 10.0, "mm")
            ),
            new BigDecimal("260.00")
        ));

        definitions.add(new SeedDefinition(
            "nut",
            "Hex Nut 0.5 in",
            "fastener_nut_hex",
            "stainless_steel",
            "300",
            List.of(
                new DimensionInput("diameter", 0.5, "in"),
                new DimensionInput("thickness", 0.4, "in")
            ),
            new BigDecimal("260.00")
        ));

        return definitions;
    }

    private static class SeedDefinition {
        private final String productType;
        private final String displayName;
        private final String calculatorId;
        private final String metalId;
        private final String alloyId;
        private final List<DimensionInput> dimensions;
        private final BigDecimal pricePerKg;
        private final Double pieces;

        private SeedDefinition(
            String productType,
            String displayName,
            String calculatorId,
            String metalId,
            String alloyId,
            List<DimensionInput> dimensions,
            BigDecimal pricePerKg
        ) {
            this.productType = productType;
            this.displayName = displayName;
            this.calculatorId = calculatorId;
            this.metalId = metalId;
            this.alloyId = alloyId;
            this.dimensions = dimensions;
            this.pricePerKg = pricePerKg;
            this.pieces = 1.0;
        }

    }
}
