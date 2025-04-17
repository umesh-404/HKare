package com.hkare.hkare_backend.repository;

import com.hkare.hkare_backend.model.Medication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MedicationRepository extends JpaRepository<Medication, Long> {
    List<Medication> findByNameContainingIgnoreCase(String name);
    
    List<Medication> findByGenericNameContainingIgnoreCase(String genericName);
    
    List<Medication> findByType(Medication.MedicationType type);
    
    List<Medication> findByDosageForm(String dosageForm);
    
    List<Medication> findByRequiresPrescription(Boolean requiresPrescription);
    
    List<Medication> findByIsActive(Boolean isActive);
    
    @Query("SELECT m FROM Medication m WHERE m.expiryDate < ?1")
    List<Medication> findExpiredMedications(LocalDate currentDate);
    
    @Query("SELECT m FROM Medication m WHERE m.expiryDate BETWEEN ?1 AND ?2")
    List<Medication> findMedicationsExpiringBetween(LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT m FROM Medication m WHERE m.stockQuantity <= m.reorderLevel")
    List<Medication> findMedicationsToReorder();
    
    @Query("SELECT m FROM Medication m WHERE m.stockQuantity = 0")
    List<Medication> findOutOfStockMedications();
    
    @Query("SELECT m FROM Medication m WHERE LOWER(m.name) LIKE LOWER(CONCAT('%', ?1, '%')) OR LOWER(m.genericName) LIKE LOWER(CONCAT('%', ?1, '%'))")
    List<Medication> searchMedications(String keyword);
} 