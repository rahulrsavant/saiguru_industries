package com.saiguru.backend.estimate;

import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/estimate")
public class EstimateController {
    private final EstimateService estimateService;

    public EstimateController(EstimateService estimateService) {
        this.estimateService = estimateService;
    }

    @GetMapping("/current")
    public ResponseEntity<EstimateSessionResponse> getCurrent(Authentication authentication) {
        String username = authentication != null ? authentication.getName() : null;
        Optional<EstimateSessionResponse> response = estimateService.getCurrentSeededEstimate(username);
        return response.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
