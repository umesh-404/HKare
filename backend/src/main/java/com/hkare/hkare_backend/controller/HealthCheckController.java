package com.hkare.hkare_backend.controller;

import jakarta.annotation.PostConstruct;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping({"/health", "/api/health"})
public class HealthCheckController {

    @PostConstruct
    public void init() {
        System.out.println("HealthCheckController initialized with mappings: /health and /api/health");
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> healthCheck() {
        System.out.println("Health check endpoint accessed");
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "API is running");
        return ResponseEntity.ok(response);
    }
} 