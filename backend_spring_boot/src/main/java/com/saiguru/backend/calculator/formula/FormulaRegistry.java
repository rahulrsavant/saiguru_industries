package com.saiguru.backend.calculator.formula;

import java.util.Map;

import org.springframework.stereotype.Component;

@Component
public class FormulaRegistry {
    private final Map<String, Formula> formulas = Map.ofEntries(
        Map.entry("ROUND_BAR", new RoundBarFormula()),
        Map.entry("SQUARE_BAR", new SquareBarFormula()),
        Map.entry("FLAT_BAR", new FlatBarFormula()),
        Map.entry("SHEET", new SheetFormula()),
        Map.entry("PIPE_ROUND", new PipeRoundFormula()),
        Map.entry("PIPE_SQUARE", new PipeSquareFormula()),
        Map.entry("PIPE_RECTANGULAR", new PipeRectangularFormula()),
        Map.entry("REBAR", new RebarFormula()),
        Map.entry("SCREW_MACHINE", new ScrewMachineFormula()),
        Map.entry("BOLT_HEX", new BoltHexFormula()),
        Map.entry("NUT_HEX", new NutHexFormula())
    );

    public Formula getFormula(String formulaKey) {
        return formulas.get(formulaKey);
    }
}
