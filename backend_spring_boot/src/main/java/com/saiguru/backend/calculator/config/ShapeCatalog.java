package com.saiguru.backend.calculator.config;

import java.util.List;
import java.util.Map;

public final class ShapeCatalog {
    public static final Map<String, ShapeDefinition> SHAPES = Map.ofEntries(
        Map.entry(
            "round_bar",
            new ShapeDefinition(
                List.of(
                    new FieldDefinition("diameter", "Diameter", "in"),
                    new FieldDefinition("length", "Length", "in")
                ),
                dimensions -> {
                    double diameter = dimensions.get("diameter");
                    double length = dimensions.get("length");
                    double radius = diameter / 2.0;
                    return Math.PI * radius * radius * length;
                }
            )
        ),
        Map.entry(
            "square_bar",
            new ShapeDefinition(
                List.of(
                    new FieldDefinition("width", "Width", "in"),
                    new FieldDefinition("thickness", "Thickness", "in"),
                    new FieldDefinition("length", "Length", "in")
                ),
                dimensions -> dimensions.get("width") * dimensions.get("thickness") * dimensions.get("length")
            )
        ),
        Map.entry(
            "hexagonal_bar",
            new ShapeDefinition(
                List.of(
                    new FieldDefinition("across_flats", "Across Flats (AF)", "in"),
                    new FieldDefinition("length", "Length", "in")
                ),
                dimensions -> 0.8660254038 * Math.pow(dimensions.get("across_flats"), 2) * dimensions.get("length")
            )
        ),
        Map.entry(
            "octagonal_bar",
            new ShapeDefinition(
                List.of(
                    new FieldDefinition("across_flats", "Across Flats (AF)", "in"),
                    new FieldDefinition("length", "Length", "in")
                ),
                dimensions -> 0.8284271247 * Math.pow(dimensions.get("across_flats"), 2) * dimensions.get("length")
            )
        ),
        Map.entry(
            "flat_bar",
            new ShapeDefinition(
                List.of(
                    new FieldDefinition("width", "Width", "in"),
                    new FieldDefinition("thickness", "Thickness", "in"),
                    new FieldDefinition("length", "Length", "in")
                ),
                dimensions -> dimensions.get("width") * dimensions.get("thickness") * dimensions.get("length")
            )
        ),
        Map.entry(
            "sheet",
            new ShapeDefinition(
                List.of(
                    new FieldDefinition("thickness", "Thickness", "in"),
                    new FieldDefinition("width", "Width", "in"),
                    new FieldDefinition("length", "Length", "in")
                ),
                dimensions -> dimensions.get("thickness") * dimensions.get("width") * dimensions.get("length")
            )
        ),
        Map.entry(
            "plate",
            new ShapeDefinition(
                List.of(
                    new FieldDefinition("thickness", "Thickness", "in"),
                    new FieldDefinition("width", "Width", "in"),
                    new FieldDefinition("length", "Length", "in")
                ),
                dimensions -> dimensions.get("thickness") * dimensions.get("width") * dimensions.get("length")
            )
        ),
        Map.entry(
            "tubular",
            new ShapeDefinition(
                List.of(
                    new FieldDefinition("outside_diameter", "Outside Diameter (OD)", "in"),
                    new FieldDefinition("wall_thickness", "Wall Thickness", "in"),
                    new FieldDefinition("length", "Length", "in")
                ),
                dimensions -> {
                    double outerRadius = dimensions.get("outside_diameter") / 2.0;
                    double wall = dimensions.get("wall_thickness");
                    double innerRadius = outerRadius - wall;
                    return Math.PI * (Math.pow(outerRadius, 2) - Math.pow(innerRadius, 2)) * dimensions.get("length");
                }
            )
        ),
        Map.entry(
            "circular",
            new ShapeDefinition(
                List.of(
                    new FieldDefinition("diameter", "Diameter", "in"),
                    new FieldDefinition("thickness", "Thickness", "in")
                ),
                dimensions -> {
                    double radius = dimensions.get("diameter") / 2.0;
                    return Math.PI * radius * radius * dimensions.get("thickness");
                }
            )
        ),
        Map.entry(
            "ring",
            new ShapeDefinition(
                List.of(
                    new FieldDefinition("outside_diameter", "Outside Diameter (OD)", "in"),
                    new FieldDefinition("inside_diameter", "Inside Diameter (ID)", "in"),
                    new FieldDefinition("thickness", "Thickness", "in")
                ),
                dimensions -> {
                    double outerRadius = dimensions.get("outside_diameter") / 2.0;
                    double innerRadius = dimensions.get("inside_diameter") / 2.0;
                    return Math.PI * (Math.pow(outerRadius, 2) - Math.pow(innerRadius, 2)) * dimensions.get("thickness");
                }
            )
        )
    );

    private ShapeCatalog() {
    }
}
