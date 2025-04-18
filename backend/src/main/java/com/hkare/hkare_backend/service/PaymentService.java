package com.hkare.hkare_backend.service;

import com.hkare.hkare_backend.dto.PaymentRequest;
import com.hkare.hkare_backend.dto.PaymentResponse;
import com.hkare.hkare_backend.model.Payment;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface PaymentService {
    /**
     * Create a new payment
     *
     * @param request Payment data
     * @return Created payment response
     */
    PaymentResponse createPayment(PaymentRequest request);
    
    /**
     * Update an existing payment
     *
     * @param paymentId Payment ID
     * @param request Updated payment data
     * @return Updated payment response
     */
    PaymentResponse updatePayment(Long paymentId, PaymentRequest request);
    
    /**
     * Get payment by ID
     *
     * @param paymentId Payment ID
     * @return Optional containing payment if found
     */
    Optional<PaymentResponse> getPaymentById(Long paymentId);
    
    /**
     * Delete payment by ID
     *
     * @param paymentId Payment ID
     * @return true if deleted successfully, false otherwise
     */
    boolean deletePayment(Long paymentId);
    
    /**
     * Get all payments
     *
     * @return List of all payments
     */
    List<PaymentResponse> getAllPayments();
    
    /**
     * Get payments for a specific patient
     *
     * @param patientId Patient ID
     * @return List of payments for the patient
     */
    List<PaymentResponse> getPaymentsByPatient(String patientId);
    
    /**
     * Get payments for a specific appointment
     *
     * @param appointmentId Appointment ID
     * @return List of payments for the appointment
     */
    List<PaymentResponse> getPaymentsByAppointment(Long appointmentId);
    
    /**
     * Get payments between two dates
     *
     * @param startDate Start date (inclusive)
     * @param endDate End date (inclusive)
     * @return List of payments between the dates
     */
    List<PaymentResponse> getPaymentsBetweenDates(LocalDateTime startDate, LocalDateTime endDate);
    
    /**
     * Get payments by status
     *
     * @param status Payment status
     * @return List of payments with the specified status
     */
    List<PaymentResponse> getPaymentsByStatus(Payment.PaymentStatus status);
    
    /**
     * Get payments by type
     *
     * @param type Payment type
     * @return List of payments with the specified type
     */
    List<PaymentResponse> getPaymentsByType(Payment.PaymentType type);
    
    /**
     * Update payment status
     *
     * @param paymentId Payment ID
     * @param status New status
     * @return Updated payment response
     */
    PaymentResponse updatePaymentStatus(Long paymentId, Payment.PaymentStatus status);
    
    /**
     * Get total revenue for a period
     *
     * @param startDate Start date (inclusive)
     * @param endDate End date (inclusive)
     * @return Total revenue for the period
     */
    Double getTotalRevenueForPeriod(LocalDateTime startDate, LocalDateTime endDate);
    
    /**
     * Get monthly revenue for a year
     *
     * @param year Year
     * @return Map with month as key and revenue as value
     */
    Map<Integer, Double> getMonthlyRevenueForYear(int year);
    
    /**
     * Get total revenue for a month
     *
     * @param year Year
     * @param month Month (1-12)
     * @return Total revenue for the month
     */
    Double getTotalRevenueForMonth(int year, int month);
    
    /**
     * Get count of payments by status
     *
     * @param status Payment status
     * @return Number of payments with the status
     */
    long countPaymentsByStatus(Payment.PaymentStatus status);
} 