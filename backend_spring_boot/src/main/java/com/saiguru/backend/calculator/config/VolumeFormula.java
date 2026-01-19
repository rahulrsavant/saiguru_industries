package com.saiguru.backend.calculator.config;

import java.util.Map;

@FunctionalInterface
public interface VolumeFormula {
    double compute(Map<String, Double> dimensionsInches);
}
