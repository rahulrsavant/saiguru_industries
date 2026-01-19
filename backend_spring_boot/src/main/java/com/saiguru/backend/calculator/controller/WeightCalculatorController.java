package com.saiguru.backend.calculator.controller;

import com.saiguru.backend.calculator.model.CalculationRequest;
import com.saiguru.backend.calculator.model.CalculationResponse;
import com.saiguru.backend.calculator.model.ErrorResponse;
import com.saiguru.backend.calculator.model.ValidationException;
import com.saiguru.backend.calculator.service.WeightCalculatorService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/weight")
public class WeightCalculatorController {
    private final WeightCalculatorService weightCalculatorService;

    public WeightCalculatorController(WeightCalculatorService weightCalculatorService) {
        this.weightCalculatorService = weightCalculatorService;
    }

    @PostMapping("/calculate")
    public CalculationResponse calculate(@RequestBody CalculationRequest request) {
        return weightCalculatorService.calculate(request);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleBadRequest(IllegalArgumentException exception) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponse(exception.getMessage()));
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ErrorResponse> handleValidationError(ValidationException exception) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(new ErrorResponse(exception.getMessage(), exception.getField()));
    }
}
