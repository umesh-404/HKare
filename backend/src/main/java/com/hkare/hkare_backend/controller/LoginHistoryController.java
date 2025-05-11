package com.hkare.hkare_backend.controller;

import com.hkare.hkare_backend.model.LoginHistory;
import com.hkare.hkare_backend.service.LoginHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/login-history")
@CrossOrigin(origins = "*")
public class LoginHistoryController {
    @Autowired
    private LoginHistoryService loginHistoryService;

    @GetMapping
    public ResponseEntity<List<LoginHistory>> getAllLoginHistory() {
        return ResponseEntity.ok(loginHistoryService.getAllLoginHistory());
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<List<LoginHistory>> getUserLoginHistory(@PathVariable String username) {
        return ResponseEntity.ok(loginHistoryService.getUserLoginHistory(username));
    }

    @GetMapping("/failed")
    public ResponseEntity<List<LoginHistory>> getFailedLogins() {
        return ResponseEntity.ok(loginHistoryService.getFailedLogins());
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<LoginHistory>> getLoginHistoryByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return ResponseEntity.ok(loginHistoryService.getLoginHistoryByDateRange(start, end));
    }

    @PostMapping
    public ResponseEntity<LoginHistory> createLoginHistory(@RequestBody LoginHistory loginHistory) {
        return ResponseEntity.ok(loginHistoryService.createLoginHistory(loginHistory));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLoginHistory(@PathVariable Long id) {
        loginHistoryService.deleteLoginHistory(id);
        return ResponseEntity.ok().build();
    }
} 