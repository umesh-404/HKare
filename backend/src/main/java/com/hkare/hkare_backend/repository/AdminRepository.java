package com.hkare.hkare_backend.repository;

import com.hkare.hkare_backend.model.Admin;
import com.hkare.hkare_backend.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, String> {
    Optional<Admin> findByUser(Users user);
    Optional<Admin> findByAdminId(String adminId);
    boolean existsByAdminId(String adminId);
} 