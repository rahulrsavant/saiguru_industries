package com.saiguru.backend.calculator.config;

import java.util.Map;

public final class AlloyDensityCatalog {
    public static final Map<String, Double> DENSITIES_LB_PER_IN3 = Map.ofEntries(
        Map.entry("steel", 0.2836),
        Map.entry("aluminum_1100", 0.0975),
        Map.entry("aluminum_2011", 0.1015),
        Map.entry("aluminum_2014", 0.1010),
        Map.entry("aluminum_2017", 0.1010),
        Map.entry("aluminum_2024", 0.1000),
        Map.entry("aluminum_3003", 0.0990),
        Map.entry("aluminum_5005", 0.0970),
        Map.entry("aluminum_5052", 0.0960),
        Map.entry("aluminum_5056", 0.0965),
        Map.entry("aluminum_5083", 0.0960),
        Map.entry("aluminum_5086", 0.0960),
        Map.entry("aluminum_6061", 0.0975),
        Map.entry("aluminum_6063", 0.0970),
        Map.entry("aluminum_7050", 0.1030),
        Map.entry("aluminum_7075", 0.1020),
        Map.entry("aluminum_7178", 0.1020),
        Map.entry("stainless_steel_300", 0.2890),
        Map.entry("stainless_steel_400", 0.2800),
        Map.entry("nickel_200", 0.3210),
        Map.entry("nickel_400", 0.3180),
        Map.entry("nickel_r_405", 0.3180),
        Map.entry("nickel_k_500", 0.3120),
        Map.entry("nickel_600", 0.3050),
        Map.entry("nickel_625", 0.3050),
        Map.entry("nickel_800h", 0.2870),
        Map.entry("nickel_800at", 0.2870),
        Map.entry("nickel_825", 0.3060),
        Map.entry("nickel_330", 0.3080),
        Map.entry("nickel_20", 0.3000),
        Map.entry("nickel_c_276", 0.3210),
        Map.entry("nickel_254smo", 0.2900),
        Map.entry("magnesium", 0.0630),
        Map.entry("beryllium", 0.0670),
        Map.entry("titanium", 0.1630),
        Map.entry("zirconium", 0.2370),
        Map.entry("cast_iron", 0.2600),
        Map.entry("zinc", 0.2580),
        Map.entry("brass", 0.3070),
        Map.entry("copper", 0.3230),
        Map.entry("columbium_niobium", 0.3140),
        Map.entry("molybdenum", 0.3750),
        Map.entry("lead", 0.4090),
        Map.entry("silver", 0.3790),
        Map.entry("tantalum", 0.6020),
        Map.entry("tungsten", 0.6970),
        Map.entry("gold", 0.6990)
    );

    private AlloyDensityCatalog() {
    }
}
