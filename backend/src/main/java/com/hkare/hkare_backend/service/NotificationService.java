package com.hkare.hkare_backend.service;

import com.hkare.hkare_backend.model.Notification;
import com.hkare.hkare_backend.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;

    public Notification createNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    public Notification markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
            .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setIsRead(true);
        notification.setReadAt(LocalDateTime.now());
        return notificationRepository.save(notification);
    }

    public List<Notification> getNotificationsByRecipient(Notification.RecipientType recipientType, String recipientId) {
        return notificationRepository.findByRecipientTypeAndRecipientIdOrderByCreatedAtDesc(recipientType, recipientId);
    }

    public List<Notification> getNotificationsByType(Notification.RecipientType recipientType) {
        return notificationRepository.findByRecipientTypeOrderByCreatedAtDesc(recipientType);
    }

    public List<Notification> getUnreadNotifications(Notification.RecipientType recipientType, String recipientId) {
        return notificationRepository.findByRecipientTypeAndRecipientIdAndIsReadOrderByCreatedAtDesc(
            recipientType, recipientId, false);
    }

    public List<Notification> getNotificationsBySender(String senderUsername) {
        return notificationRepository.findBySenderUsernameOrderByCreatedAtDesc(senderUsername);
    }

    public List<Notification> getNotificationsByPriority(String priority) {
        return notificationRepository.findByPriorityOrderByCreatedAtDesc(priority);
    }

    public void deleteNotification(Long notificationId) {
        notificationRepository.deleteById(notificationId);
    }

    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }
} 