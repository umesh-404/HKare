package com.hkare.hkare_backend.service;

import com.hkare.hkare_backend.model.LoginHistory;
import com.hkare.hkare_backend.repository.LoginHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class LoginHistoryService {
    @Autowired
    private LoginHistoryRepository loginHistoryRepository;

    public LoginHistory recordLogin(String username, String ipAddress, String userAgent, boolean success, String failureReason) {
        LoginHistory loginHistory = new LoginHistory();
        loginHistory.setUsername(username);
        loginHistory.setLoginTime(LocalDateTime.now());
        loginHistory.setIpAddress(ipAddress);
        loginHistory.setUserAgent(userAgent);
        loginHistory.setLoginSuccess(success);
        loginHistory.setFailureReason(failureReason);
        return loginHistoryRepository.save(loginHistory);
    }

    public List<LoginHistory> getUserLoginHistory(String username) {
        return loginHistoryRepository.findByUsernameOrderByLoginTimeDesc(username);
    }

    public List<LoginHistory> getLoginHistoryByDateRange(LocalDateTime start, LocalDateTime end) {
        return loginHistoryRepository.findByLoginTimeBetweenOrderByLoginTimeDesc(start, end);
    }

    public List<LoginHistory> getFailedLogins() {
        return loginHistoryRepository.findByLoginSuccessOrderByLoginTimeDesc(false);
    }

    public List<LoginHistory> getAllLoginHistory() {
        return loginHistoryRepository.findAll();
    }

    public LoginHistory createLoginHistory(LoginHistory loginHistory) {
        if (loginHistory.getLoginTime() == null) {
            loginHistory.setLoginTime(java.time.LocalDateTime.now());
        }
        if (loginHistory.getIpAddress() == null) {
            loginHistory.setIpAddress("");
        }
        if (loginHistory.getUserAgent() == null) {
            loginHistory.setUserAgent("");
        }
        if (loginHistory.getUsername() == null) {
            loginHistory.setUsername("unknown");
        }
        return loginHistoryRepository.save(loginHistory);
    }

    public void deleteLoginHistory(Long id) {
        loginHistoryRepository.deleteById(id);
    }
} 