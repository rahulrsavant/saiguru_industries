package com.saiguru.backend.calculator.controller;

import com.saiguru.backend.calculator.model.CalculationRequestV2;
import com.saiguru.backend.calculator.model.CalculationResult;
import com.saiguru.backend.calculator.service.CalculationEngineService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CalculationController {
    private final CalculationEngineService calculationEngineService;

    public CalculationController(CalculationEngineService calculationEngineService) {
        this.calculationEngineService = calculationEngineService;
    }

    @PostMapping({"/api/calculate", "/calculate"})
    public CalculationResult calculate(@RequestBody CalculationRequestV2 request) {
        return calculationEngineService.calculate(request);
    }
}
