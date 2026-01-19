package com.saiguru.backend.calculator.util;

import java.util.Map;

public final class UnitConverter {
    private static final Map<String, Double> TO_INCHES = Map.ofEntries(
        Map.entry("in", 1.0),
        Map.entry("ft", 12.0),
        Map.entry("yd", 36.0),
        Map.entry("mm", 0.0393700787),
        Map.entry("cm", 0.393700787),
        Map.entry("m", 39.3700787)
    );

    private UnitConverter() {
    }

    public static double toInches(double value, String unit) {
        Double multiplier = TO_INCHES.get(unit);
        if (multiplier == null) {
            throw new IllegalArgumentException("Unsupported unit: " + unit);
        }
        return value * multiplier;
    }
}
