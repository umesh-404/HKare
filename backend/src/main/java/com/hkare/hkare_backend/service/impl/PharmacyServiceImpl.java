package com.hkare.hkare_backend.service.impl;

import com.hkare.hkare_backend.dto.PharmacyRequest;
import com.hkare.hkare_backend.dto.PharmacyResponse;
import com.hkare.hkare_backend.model.Pharmacy;
import com.hkare.hkare_backend.repository.PharmacyRepository;
import com.hkare.hkare_backend.service.PharmacyService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PharmacyServiceImpl implements PharmacyService {
    private final PharmacyRepository pharmacyRepository;

    @Override
    @Transactional
    public PharmacyResponse createPharmacy(PharmacyRequest request) {
        Pharmacy pharmacy = mapRequestToEntity(request);
        Pharmacy savedPharmacy = pharmacyRepository.save(pharmacy);
        return mapEntityToResponse(savedPharmacy);
    }

    @Override
    @Transactional
    public PharmacyResponse updatePharmacy(Long pharmacyId, PharmacyRequest request) {
        Pharmacy pharmacy = pharmacyRepository.findById(pharmacyId)
                .orElseThrow(() -> new EntityNotFoundException("Pharmacy not found with ID: " + pharmacyId));

        updatePharmacyFromRequest(pharmacy, request);

        Pharmacy updatedPharmacy = pharmacyRepository.save(pharmacy);
        return mapEntityToResponse(updatedPharmacy);
    }

    @Override
    public Optional<PharmacyResponse> getPharmacyById(Long pharmacyId) {
        return pharmacyRepository.findById(pharmacyId)
                .map(this::mapEntityToResponse);
    }

    @Override
    @Transactional
    public boolean deletePharmacy(Long pharmacyId) {
        if (pharmacyRepository.existsById(pharmacyId)) {
            pharmacyRepository.deleteById(pharmacyId);
            return true;
        }
        return false;
    }

    @Override
    public List<PharmacyResponse> getAllPharmacies() {
        return pharmacyRepository.findAll().stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<PharmacyResponse> searchPharmacies(String keyword) {
        return pharmacyRepository.searchPharmacies(keyword).stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<PharmacyResponse> getPharmaciesByStatus(Boolean isActive) {
        return pharmacyRepository.findByIsActive(isActive).stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<PharmacyResponse> getPharmaciesByAddress(String city, String state, String zip) {
        return pharmacyRepository.findByAddressContaining(city, state, zip).stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<PharmacyResponse> findNearbyPharmacies(Double latitude, Double longitude, Double radiusInKm) {
        return pharmacyRepository.findNearbyPharmacies(latitude, longitude, radiusInKm).stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public PharmacyResponse togglePharmacyStatus(Long pharmacyId, Boolean isActive) {
        Pharmacy pharmacy = pharmacyRepository.findById(pharmacyId)
                .orElseThrow(() -> new EntityNotFoundException("Pharmacy not found with ID: " + pharmacyId));
        
        pharmacy.setIsActive(isActive);
        Pharmacy updatedPharmacy = pharmacyRepository.save(pharmacy);
        return mapEntityToResponse(updatedPharmacy);
    }

    @Override
    public List<PharmacyResponse> getPharmaciesByCityAndState(String city, String state) {
        return pharmacyRepository.findByCityAndState(city, state).stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<PharmacyResponse> getPharmaciesByName(String name) {
        return pharmacyRepository.findByNameContainingIgnoreCase(name).stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<PharmacyResponse> getPharmaciesByCity(String city) {
        return pharmacyRepository.findByCityIgnoreCase(city).stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<PharmacyResponse> getPharmaciesByState(String state) {
        return pharmacyRepository.findByStateIgnoreCase(state).stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<PharmacyResponse> getPharmaciesByZipCode(String zipCode) {
        return pharmacyRepository.findByZipCode(zipCode).stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<PharmacyResponse> getAllActivePharmacies() {
        return pharmacyRepository.findAllActivePharmacies().stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }

    private Pharmacy mapRequestToEntity(PharmacyRequest request) {
        Pharmacy pharmacy = new Pharmacy();
        pharmacy.setName(request.getName());
        pharmacy.setAddress(request.getAddress());
        pharmacy.setCity(request.getCity());
        pharmacy.setState(request.getState());
        pharmacy.setZipCode(request.getZipCode());
        pharmacy.setCountry(request.getCountry());
        pharmacy.setLatitude(request.getLatitude());
        pharmacy.setLongitude(request.getLongitude());
        pharmacy.setPhoneNumber(request.getPhoneNumber());
        pharmacy.setEmail(request.getEmail());
        pharmacy.setWebsite(request.getWebsite());
        pharmacy.setOperatingHours(request.getOperatingHours());
        pharmacy.setLicenseNumber(request.getLicenseNumber());
        pharmacy.setIsActive(request.getIsActive());
        return pharmacy;
    }

    private void updatePharmacyFromRequest(Pharmacy pharmacy, PharmacyRequest request) {
        if (request.getName() != null) {
            pharmacy.setName(request.getName());
        }
        if (request.getAddress() != null) {
            pharmacy.setAddress(request.getAddress());
        }
        if (request.getCity() != null) {
            pharmacy.setCity(request.getCity());
        }
        if (request.getState() != null) {
            pharmacy.setState(request.getState());
        }
        if (request.getZipCode() != null) {
            pharmacy.setZipCode(request.getZipCode());
        }
        if (request.getCountry() != null) {
            pharmacy.setCountry(request.getCountry());
        }
        if (request.getLatitude() != null) {
            pharmacy.setLatitude(request.getLatitude());
        }
        if (request.getLongitude() != null) {
            pharmacy.setLongitude(request.getLongitude());
        }
        if (request.getPhoneNumber() != null) {
            pharmacy.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getEmail() != null) {
            pharmacy.setEmail(request.getEmail());
        }
        if (request.getWebsite() != null) {
            pharmacy.setWebsite(request.getWebsite());
        }
        if (request.getOperatingHours() != null) {
            pharmacy.setOperatingHours(request.getOperatingHours());
        }
        if (request.getLicenseNumber() != null) {
            pharmacy.setLicenseNumber(request.getLicenseNumber());
        }
        if (request.getIsActive() != null) {
            pharmacy.setIsActive(request.getIsActive());
        }
    }

    private PharmacyResponse mapEntityToResponse(Pharmacy pharmacy) {
        return PharmacyResponse.builder()
                .pharmacyId(pharmacy.getPharmacyId())
                .name(pharmacy.getName())
                .address(pharmacy.getAddress())
                .city(pharmacy.getCity())
                .state(pharmacy.getState())
                .zipCode(pharmacy.getZipCode())
                .country(pharmacy.getCountry())
                .latitude(pharmacy.getLatitude())
                .longitude(pharmacy.getLongitude())
                .phoneNumber(pharmacy.getPhoneNumber())
                .email(pharmacy.getEmail())
                .website(pharmacy.getWebsite())
                .operatingHours(pharmacy.getOperatingHours())
                .licenseNumber(pharmacy.getLicenseNumber())
                .isActive(pharmacy.getIsActive())
                .createdAt(pharmacy.getCreatedAt())
                .updatedAt(pharmacy.getUpdatedAt())
                .build();
    }
} 