package com.hkare.hkare_backend.repository;

import com.hkare.hkare_backend.model.LoginHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LoginHistoryRepository extends JpaRepository<LoginHistory, Long> {
    List<LoginHistory> findByUsernameOrderByLoginTimeDesc(String username);
    List<LoginHistory> findByLoginTimeBetweenOrderByLoginTimeDesc(LocalDateTime start, LocalDateTime end);
    List<LoginHistory> findByLoginSuccessOrderByLoginTimeDesc(boolean loginSuccess);
} 