package com.hkare.hkare_backend.repository;

import com.hkare.hkare_backend.model.Staff;
import com.hkare.hkare_backend.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StaffRepository extends JpaRepository<Staff, String> {
    Optional<Staff> findByUser(Users user);
    Optional<Staff> findByStaffId(String staffId);
    boolean existsByStaffId(String staffId);
} 