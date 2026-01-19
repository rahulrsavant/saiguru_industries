package com.saiguru.backend.calculator.formula;

import java.util.Map;

import org.springframework.stereotype.Component;

@Component
public class FormulaRegistry {
    private final Map<String, Formula> formulas = Map.ofEntries(
        Map.entry("ROUND_BAR", new RoundBarFormula()),
        Map.entry("SQUARE_BAR", new SquareBarFormula()),
        Map.entry("PIPE_ROUND", new PipeRoundFormula())
    );

    public Formula getFormula(String formulaKey) {
        return formulas.get(formulaKey);
    }
}
