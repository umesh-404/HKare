package com.hkare.hkare_backend.repository;

import com.hkare.hkare_backend.model.Pharmacy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PharmacyRepository extends JpaRepository<Pharmacy, Long> {
    List<Pharmacy> findByNameContainingIgnoreCase(String name);
    
    List<Pharmacy> findByIsActive(Boolean isActive);
    
    List<Pharmacy> findByCityIgnoreCase(String city);
    
    List<Pharmacy> findByStateIgnoreCase(String state);
    
    List<Pharmacy> findByZipCode(String zipCode);
    
    @Query("SELECT p FROM Pharmacy p WHERE LOWER(p.city) = LOWER(?1) AND LOWER(p.state) = LOWER(?2)")
    List<Pharmacy> findByCityAndState(String city, String state);
    
    @Query("SELECT p FROM Pharmacy p WHERE p.isActive = true ORDER BY p.name")
    List<Pharmacy> findAllActivePharmacies();
    
    @Query("SELECT p FROM Pharmacy p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', ?1, '%')) OR LOWER(p.address) LIKE LOWER(CONCAT('%', ?1, '%'))")
    List<Pharmacy> searchPharmacies(String keyword);
    
    @Query("SELECT p FROM Pharmacy p WHERE " +
           "(LOWER(p.city) LIKE LOWER(CONCAT('%', ?1, '%')) OR ?1 IS NULL) AND " +
           "(LOWER(p.state) LIKE LOWER(CONCAT('%', ?2, '%')) OR ?2 IS NULL) AND " +
           "(p.zipCode LIKE CONCAT('%', ?3, '%') OR ?3 IS NULL)")
    List<Pharmacy> findByAddressContaining(String city, String state, String zipCode);
    
    @Query(value = "SELECT * FROM pharmacies p " +
           "WHERE (6371 * acos(cos(radians(?1)) * cos(radians(p.latitude)) * " +
           "cos(radians(p.longitude) - radians(?2)) + sin(radians(?1)) * " +
           "sin(radians(p.latitude)))) < ?3", nativeQuery = true)
    List<Pharmacy> findNearbyPharmacies(Double latitude, Double longitude, Double radiusInKm);
} 