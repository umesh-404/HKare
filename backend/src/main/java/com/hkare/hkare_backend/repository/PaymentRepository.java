package com.hkare.hkare_backend.repository;

import com.hkare.hkare_backend.model.Appointment;
import com.hkare.hkare_backend.model.Patient;
import com.hkare.hkare_backend.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByPatient(Patient patient);
    List<Payment> findByAppointment(Appointment appointment);
    List<Payment> findByStatus(Payment.PaymentStatus status);
    List<Payment> findByType(Payment.PaymentType type);
    
    @Query("SELECT p FROM Payment p WHERE p.paymentDate BETWEEN ?1 AND ?2")
    List<Payment> findPaymentsBetweenDates(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT p FROM Payment p WHERE p.patient.patientId = ?1 AND p.paymentDate BETWEEN ?2 AND ?3")
    List<Payment> findPatientPaymentsBetweenDates(String patientId, LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'COMPLETED' AND p.paymentDate BETWEEN ?1 AND ?2")
    Double getTotalRevenueForPeriod(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT COUNT(p) FROM Payment p WHERE p.status = ?1")
    long countPaymentsByStatus(Payment.PaymentStatus status);
    
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'COMPLETED' AND FUNCTION('YEAR', p.paymentDate) = ?1 AND FUNCTION('MONTH', p.paymentDate) = ?2")
    Double getTotalRevenueForMonth(int year, int month);
    
    @Query(value = "SELECT MONTH(payment_date) as month, SUM(amount) as total FROM payments WHERE status = 'COMPLETED' AND YEAR(payment_date) = ?1 GROUP BY MONTH(payment_date) ORDER BY month", nativeQuery = true)
    List<Object[]> getMonthlyRevenueForYear(int year);
} 