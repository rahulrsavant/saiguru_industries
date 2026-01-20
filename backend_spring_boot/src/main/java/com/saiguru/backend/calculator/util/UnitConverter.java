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
    private static final Map<String, Double> TO_MILLIMETERS = Map.ofEntries(
        Map.entry("mm", 1.0),
        Map.entry("cm", 10.0),
        Map.entry("m", 1000.0),
        Map.entry("in", 25.4),
        Map.entry("ft", 304.8),
        Map.entry("yd", 914.4)
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

    public static double toMillimeters(double value, String unit) {
        Double multiplier = TO_MILLIMETERS.get(unit);
        if (multiplier == null) {
            throw new IllegalArgumentException("Unsupported unit: " + unit);
        }
        return value * multiplier;
    }

    public static double toCentimeters(double value, String unit) {
        return toMillimeters(value, unit) / 10.0;
    }
}
