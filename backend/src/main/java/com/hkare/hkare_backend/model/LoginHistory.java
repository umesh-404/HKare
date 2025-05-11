package com.hkare.hkare_backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "login_history")
public class LoginHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private LocalDateTime loginTime;

    @Column(nullable = false)
    private String ipAddress;

    @Column(nullable = false)
    private String userAgent;

    @Column(nullable = false)
    private boolean loginSuccess;

    @Column
    private String failureReason;

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public java.time.LocalDateTime getLoginTime() { return loginTime; }
    public void setLoginTime(java.time.LocalDateTime loginTime) { this.loginTime = loginTime; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

    public String getUserAgent() { return userAgent; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }

    public boolean isLoginSuccess() { return loginSuccess; }
    public void setLoginSuccess(boolean loginSuccess) { this.loginSuccess = loginSuccess; }

    public String getFailureReason() { return failureReason; }
    public void setFailureReason(String failureReason) { this.failureReason = failureReason; }
} 