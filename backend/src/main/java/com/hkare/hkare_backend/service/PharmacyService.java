package com.hkare.hkare_backend.service;

import com.hkare.hkare_backend.dto.PharmacyRequest;
import com.hkare.hkare_backend.dto.PharmacyResponse;

import java.util.List;
import java.util.Optional;

public interface PharmacyService {
    /**
     * Create a new pharmacy
     *
     * @param request Pharmacy data
     * @return Created pharmacy response
     */
    PharmacyResponse createPharmacy(PharmacyRequest request);
    
    /**
     * Update an existing pharmacy
     *
     * @param pharmacyId Pharmacy ID
     * @param request Updated pharmacy data
     * @return Updated pharmacy response
     */
    PharmacyResponse updatePharmacy(Long pharmacyId, PharmacyRequest request);
    
    /**
     * Get pharmacy by ID
     *
     * @param pharmacyId Pharmacy ID
     * @return Optional containing pharmacy if found
     */
    Optional<PharmacyResponse> getPharmacyById(Long pharmacyId);
    
    /**
     * Delete pharmacy by ID
     *
     * @param pharmacyId Pharmacy ID
     * @return true if deleted successfully, false otherwise
     */
    boolean deletePharmacy(Long pharmacyId);
    
    /**
     * Get all pharmacies
     *
     * @return List of all pharmacies
     */
    List<PharmacyResponse> getAllPharmacies();
    
    /**
     * Get all active pharmacies
     *
     * @return List of active pharmacies
     */
    List<PharmacyResponse> getAllActivePharmacies();
    
    /**
     * Search pharmacies by keyword
     *
     * @param keyword Search keyword
     * @return List of pharmacies matching the search
     */
    List<PharmacyResponse> searchPharmacies(String keyword);
    
    /**
     * Get pharmacies by name
     *
     * @param name Pharmacy name
     * @return List of pharmacies with matching name
     */
    List<PharmacyResponse> getPharmaciesByName(String name);
    
    /**
     * Get pharmacies by city
     *
     * @param city City name
     * @return List of pharmacies in the city
     */
    List<PharmacyResponse> getPharmaciesByCity(String city);
    
    /**
     * Get pharmacies by state
     *
     * @param state State name
     * @return List of pharmacies in the state
     */
    List<PharmacyResponse> getPharmaciesByState(String state);
    
    /**
     * Get pharmacies by ZIP code
     *
     * @param zipCode ZIP code
     * @return List of pharmacies with the ZIP code
     */
    List<PharmacyResponse> getPharmaciesByZipCode(String zipCode);
    
    /**
     * Get pharmacies by city and state
     *
     * @param city City name
     * @param state State name
     * @return List of pharmacies in the city and state
     */
    List<PharmacyResponse> getPharmaciesByCityAndState(String city, String state);
    
    /**
     * Toggle pharmacy active status
     *
     * @param pharmacyId Pharmacy ID
     * @param isActive Active status
     * @return Updated pharmacy response
     */
    PharmacyResponse togglePharmacyStatus(Long pharmacyId, Boolean isActive);
    
    /**
     * Get pharmacies by status (active/inactive)
     * 
     * @param isActive Status to filter by
     * @return List of pharmacies with the specified status
     */
    List<PharmacyResponse> getPharmaciesByStatus(Boolean isActive);
    
    /**
     * Get pharmacies by address components
     * 
     * @param city City name
     * @param state State name
     * @param zip Zip code
     * @return List of pharmacies matching the address criteria
     */
    List<PharmacyResponse> getPharmaciesByAddress(String city, String state, String zip);
    
    /**
     * Find pharmacies near a specific location
     * 
     * @param latitude Latitude coordinate
     * @param longitude Longitude coordinate
     * @param radiusInKm Search radius in kilometers
     * @return List of pharmacies within the specified radius
     */
    List<PharmacyResponse> findNearbyPharmacies(Double latitude, Double longitude, Double radiusInKm);
} 