package com.hkare.hkare_backend.controller;

import com.hkare.hkare_backend.model.Notification;
import com.hkare.hkare_backend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:5173")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/recipient/{recipientType}/{recipientId}")
    public ResponseEntity<List<Notification>> getNotificationsByRecipient(
            @PathVariable Notification.RecipientType recipientType,
            @PathVariable String recipientId) {
        List<Notification> notifications = notificationService.getNotificationsByRecipient(recipientType, recipientId);
        return ResponseEntity.ok(notifications);
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(@PathVariable Long id) {
        Notification notification = notificationService.markAsRead(id);
        return ResponseEntity.ok(notification);
    }

    @PostMapping
    public ResponseEntity<Notification> createNotification(@RequestBody Notification notification) {
        Notification createdNotification = notificationService.createNotification(notification);
        return ResponseEntity.ok(createdNotification);
    }

    @GetMapping("/unread/{recipientType}/{recipientId}")
    public ResponseEntity<List<Notification>> getUnreadNotifications(
            @PathVariable Notification.RecipientType recipientType,
            @PathVariable String recipientId) {
        List<Notification> notifications = notificationService.getUnreadNotifications(recipientType, recipientId);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping
    public List<Notification> getAllNotifications() {
        return notificationService.getAllNotifications();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.noContent().build();
    }
} 