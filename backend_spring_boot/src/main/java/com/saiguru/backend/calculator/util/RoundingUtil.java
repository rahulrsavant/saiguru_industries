package com.saiguru.backend.calculator.util;

import java.math.BigDecimal;
import java.math.RoundingMode;

public final class RoundingUtil {
    private RoundingUtil() {
    }

    public static double round(double value, int scale) {
        return BigDecimal.valueOf(value).setScale(scale, RoundingMode.HALF_UP).doubleValue();
    }
}
