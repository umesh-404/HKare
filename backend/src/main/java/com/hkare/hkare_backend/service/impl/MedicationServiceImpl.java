package com.hkare.hkare_backend.service.impl;

import com.hkare.hkare_backend.dto.MedicationRequest;
import com.hkare.hkare_backend.dto.MedicationResponse;
import com.hkare.hkare_backend.model.Medication;
import com.hkare.hkare_backend.repository.MedicationRepository;
import com.hkare.hkare_backend.service.MedicationService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MedicationServiceImpl implements MedicationService {
    private final MedicationRepository medicationRepository;

    @Override
    @Transactional
    public MedicationResponse createMedication(MedicationRequest request) {
        Medication medication = mapRequestToEntity(request);
        Medication savedMedication = medicationRepository.save(medication);
        return mapEntityToResponse(savedMedication);
    }

    @Override
    @Transactional
    public MedicationResponse updateMedication(Long medicationId, MedicationRequest request) {
        Medication medication = medicationRepository.findById(medicationId)
                .orElseThrow(() -> new EntityNotFoundException("Medication not found with ID: " + medicationId));

        updateMedicationFromRequest(medication, request);

        Medication updatedMedication = medicationRepository.save(medication);
        return mapEntityToResponse(updatedMedication);
    }

    @Override
    public Optional<MedicationResponse> getMedicationById(Long medicationId) {
        return medicationRepository.findById(medicationId)
                .map(this::mapEntityToResponse);
    }

    @Override
    @Transactional
    public boolean deleteMedication(Long medicationId) {
        if (medicationRepository.existsById(medicationId)) {
            medicationRepository.deleteById(medicationId);
            return true;
        }
        return false;
    }

    @Override
    public List<MedicationResponse> getAllMedications() {
        return medicationRepository.findAll().stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<MedicationResponse> searchMedications(String keyword) {
        return medicationRepository.searchMedications(keyword).stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<MedicationResponse> getMedicationsByType(Medication.MedicationType type) {
        return medicationRepository.findByType(type).stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<MedicationResponse> getMedicationsByDosageForm(String dosageForm) {
        return medicationRepository.findByDosageForm(dosageForm).stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<MedicationResponse> getMedicationsByPrescriptionRequirement(Boolean requiresPrescription) {
        return medicationRepository.findByRequiresPrescription(requiresPrescription).stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<MedicationResponse> getMedicationsByActiveStatus(Boolean isActive) {
        return medicationRepository.findByIsActive(isActive).stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<MedicationResponse> getExpiredMedications() {
        LocalDate today = LocalDate.now();
        return medicationRepository.findExpiredMedications(today).stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<MedicationResponse> getMedicationsExpiringBetween(LocalDate startDate, LocalDate endDate) {
        return medicationRepository.findMedicationsExpiringBetween(startDate, endDate).stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<MedicationResponse> getMedicationsToReorder() {
        return medicationRepository.findMedicationsToReorder().stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<MedicationResponse> getOutOfStockMedications() {
        return medicationRepository.findOutOfStockMedications().stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public MedicationResponse updateMedicationStock(Long medicationId, Integer quantity) {
        Medication medication = medicationRepository.findById(medicationId)
                .orElseThrow(() -> new EntityNotFoundException("Medication not found with ID: " + medicationId));

        int currentStock = medication.getStockQuantity() != null ? medication.getStockQuantity() : 0;
        int newStock = currentStock + quantity;

        if (newStock < 0) {
            throw new IllegalArgumentException("Cannot reduce stock below zero. Current stock: " + currentStock + ", Requested reduction: " + Math.abs(quantity));
        }

        medication.setStockQuantity(newStock);
        Medication updatedMedication = medicationRepository.save(medication);
        return mapEntityToResponse(updatedMedication);
    }

    @Override
    public boolean isMedicationAvailable(Long medicationId, Integer requiredQuantity) {
        Medication medication = medicationRepository.findById(medicationId)
                .orElseThrow(() -> new EntityNotFoundException("Medication not found with ID: " + medicationId));

        int currentStock = medication.getStockQuantity() != null ? medication.getStockQuantity() : 0;
        return medication.getIsActive() && currentStock >= requiredQuantity;
    }

    private Medication mapRequestToEntity(MedicationRequest request) {
        Medication medication = new Medication();
        medication.setName(request.getName());
        medication.setGenericName(request.getGenericName());
        medication.setBrand(request.getBrand());
        medication.setManufacturer(request.getManufacturer());
        medication.setType(request.getType());
        medication.setDescription(request.getDescription());
        medication.setDosageForm(request.getDosageForm());
        medication.setStrength(request.getStrength());
        medication.setDosageUnit(request.getDosageUnit());
        medication.setSideEffects(request.getSideEffects());
        medication.setContraindications(request.getContraindications());
        medication.setStorage(request.getStorage());
        medication.setRequiresPrescription(request.getRequiresPrescription());
        medication.setPrice(request.getPrice());
        medication.setStockQuantity(request.getStockQuantity());
        medication.setReorderLevel(request.getReorderLevel());
        medication.setBatchNumber(request.getBatchNumber());
        medication.setManufactureDate(request.getManufactureDate());
        medication.setExpiryDate(request.getExpiryDate());
        medication.setBarcode(request.getBarcode());
        medication.setNDCCode(request.getNDCCode());
        medication.setIsActive(request.getIsActive());
        return medication;
    }

    private void updateMedicationFromRequest(Medication medication, MedicationRequest request) {
        if (request.getName() != null) {
            medication.setName(request.getName());
        }
        if (request.getGenericName() != null) {
            medication.setGenericName(request.getGenericName());
        }
        if (request.getBrand() != null) {
            medication.setBrand(request.getBrand());
        }
        if (request.getManufacturer() != null) {
            medication.setManufacturer(request.getManufacturer());
        }
        if (request.getType() != null) {
            medication.setType(request.getType());
        }
        if (request.getDescription() != null) {
            medication.setDescription(request.getDescription());
        }
        if (request.getDosageForm() != null) {
            medication.setDosageForm(request.getDosageForm());
        }
        if (request.getStrength() != null) {
            medication.setStrength(request.getStrength());
        }
        if (request.getDosageUnit() != null) {
            medication.setDosageUnit(request.getDosageUnit());
        }
        if (request.getSideEffects() != null) {
            medication.setSideEffects(request.getSideEffects());
        }
        if (request.getContraindications() != null) {
            medication.setContraindications(request.getContraindications());
        }
        if (request.getStorage() != null) {
            medication.setStorage(request.getStorage());
        }
        if (request.getRequiresPrescription() != null) {
            medication.setRequiresPrescription(request.getRequiresPrescription());
        }
        if (request.getPrice() != null) {
            medication.setPrice(request.getPrice());
        }
        if (request.getStockQuantity() != null) {
            medication.setStockQuantity(request.getStockQuantity());
        }
        if (request.getReorderLevel() != null) {
            medication.setReorderLevel(request.getReorderLevel());
        }
        if (request.getBatchNumber() != null) {
            medication.setBatchNumber(request.getBatchNumber());
        }
        if (request.getManufactureDate() != null) {
            medication.setManufactureDate(request.getManufactureDate());
        }
        if (request.getExpiryDate() != null) {
            medication.setExpiryDate(request.getExpiryDate());
        }
        if (request.getBarcode() != null) {
            medication.setBarcode(request.getBarcode());
        }
        if (request.getNDCCode() != null) {
            medication.setNDCCode(request.getNDCCode());
        }
        if (request.getIsActive() != null) {
            medication.setIsActive(request.getIsActive());
        }
    }

    private MedicationResponse mapEntityToResponse(Medication medication) {
        LocalDate today = LocalDate.now();
        boolean isExpired = medication.getExpiryDate() != null && medication.getExpiryDate().isBefore(today);
        boolean isLowStock = medication.getReorderLevel() != null && medication.getStockQuantity() != null && 
                             medication.getStockQuantity() <= medication.getReorderLevel();
        Integer daysUntilExpiry = null;
        if (medication.getExpiryDate() != null) {
            if (isExpired) {
                daysUntilExpiry = -Period.between(medication.getExpiryDate(), today).getDays();
            } else {
                daysUntilExpiry = Period.between(today, medication.getExpiryDate()).getDays();
            }
        }

        return MedicationResponse.builder()
                .medicationId(medication.getMedicationId())
                .name(medication.getName())
                .genericName(medication.getGenericName())
                .brand(medication.getBrand())
                .manufacturer(medication.getManufacturer())
                .type(medication.getType())
                .description(medication.getDescription())
                .dosageForm(medication.getDosageForm())
                .strength(medication.getStrength())
                .dosageUnit(medication.getDosageUnit())
                .sideEffects(medication.getSideEffects())
                .contraindications(medication.getContraindications())
                .storage(medication.getStorage())
                .requiresPrescription(medication.getRequiresPrescription())
                .price(medication.getPrice())
                .stockQuantity(medication.getStockQuantity())
                .reorderLevel(medication.getReorderLevel())
                .batchNumber(medication.getBatchNumber())
                .manufactureDate(medication.getManufactureDate())
                .expiryDate(medication.getExpiryDate())
                .barcode(medication.getBarcode())
                .NDCCode(medication.getNDCCode())
                .isActive(medication.getIsActive())
                .createdAt(medication.getCreatedAt())
                .updatedAt(medication.getUpdatedAt())
                .isExpired(isExpired)
                .isLowStock(isLowStock)
                .daysUntilExpiry(daysUntilExpiry)
                .build();
    }
} 