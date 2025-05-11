package com.hkare.hkare_backend.controller;

import com.hkare.hkare_backend.model.AuditLog;
import com.hkare.hkare_backend.service.AuditLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
@CrossOrigin(origins = "*")
public class AuditLogController {
    @Autowired
    private AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<List<AuditLog>> getAllAuditLogs() {
        return ResponseEntity.ok(auditLogService.getAllAuditLogs());
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<List<AuditLog>> getUserAuditLogs(@PathVariable String username) {
        return ResponseEntity.ok(auditLogService.getUserAuditLogs(username));
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<AuditLog>> getAuditLogsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return ResponseEntity.ok(auditLogService.getAuditLogsByDateRange(start, end));
    }

    @GetMapping("/entity")
    public ResponseEntity<List<AuditLog>> getAuditLogsByEntity(
            @RequestParam String entityType,
            @RequestParam String entityId) {
        return ResponseEntity.ok(auditLogService.getAuditLogsByEntity(entityType, entityId));
    }

    @GetMapping("/action/{action}")
    public ResponseEntity<List<AuditLog>> getAuditLogsByAction(@PathVariable String action) {
        return ResponseEntity.ok(auditLogService.getAuditLogsByAction(action));
    }

    @PostMapping
    public ResponseEntity<AuditLog> createAuditLog(@RequestBody AuditLog auditLog) {
        return ResponseEntity.ok(auditLogService.createAuditLog(auditLog));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAuditLog(@PathVariable Long id) {
        auditLogService.deleteAuditLog(id);
        return ResponseEntity.ok().build();
    }
} 