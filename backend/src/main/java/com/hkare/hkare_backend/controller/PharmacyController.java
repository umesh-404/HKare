package com.hkare.hkare_backend.controller;

import com.hkare.hkare_backend.dto.PharmacyRequest;
import com.hkare.hkare_backend.dto.PharmacyResponse;
import com.hkare.hkare_backend.service.PharmacyService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pharmacies")
@RequiredArgsConstructor
public class PharmacyController {
    private final PharmacyService pharmacyService;

    @PostMapping
    public ResponseEntity<PharmacyResponse> createPharmacy(@Valid @RequestBody PharmacyRequest request) {
        PharmacyResponse response = pharmacyService.createPharmacy(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{pharmacyId}")
    public ResponseEntity<PharmacyResponse> updatePharmacy(
            @PathVariable Long pharmacyId,
            @Valid @RequestBody PharmacyRequest request) {
        try {
            PharmacyResponse response = pharmacyService.updatePharmacy(pharmacyId, request);
            return ResponseEntity.ok(response);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{pharmacyId}")
    public ResponseEntity<PharmacyResponse> getPharmacyById(@PathVariable Long pharmacyId) {
        return pharmacyService.getPharmacyById(pharmacyId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{pharmacyId}")
    public ResponseEntity<Void> deletePharmacy(@PathVariable Long pharmacyId) {
        boolean deleted = pharmacyService.deletePharmacy(pharmacyId);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @GetMapping
    public ResponseEntity<List<PharmacyResponse>> getAllPharmacies() {
        List<PharmacyResponse> pharmacies = pharmacyService.getAllPharmacies();
        return ResponseEntity.ok(pharmacies);
    }

    @GetMapping("/search")
    public ResponseEntity<List<PharmacyResponse>> searchPharmacies(@RequestParam String keyword) {
        List<PharmacyResponse> pharmacies = pharmacyService.searchPharmacies(keyword);
        return ResponseEntity.ok(pharmacies);
    }

    @GetMapping("/status")
    public ResponseEntity<List<PharmacyResponse>> getPharmaciesByStatus(@RequestParam Boolean isActive) {
        List<PharmacyResponse> pharmacies = pharmacyService.getPharmaciesByStatus(isActive);
        return ResponseEntity.ok(pharmacies);
    }

    @GetMapping("/address")
    public ResponseEntity<List<PharmacyResponse>> getPharmaciesByAddress(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String zip) {
        List<PharmacyResponse> pharmacies = pharmacyService.getPharmaciesByAddress(city, state, zip);
        return ResponseEntity.ok(pharmacies);
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<PharmacyResponse>> findNearbyPharmacies(
            @RequestParam Double latitude,
            @RequestParam Double longitude,
            @RequestParam(defaultValue = "5.0") Double radiusInKm) {
        List<PharmacyResponse> pharmacies = pharmacyService.findNearbyPharmacies(latitude, longitude, radiusInKm);
        return ResponseEntity.ok(pharmacies);
    }
} 