package com.hkare.hkare_backend.repository; 

import com.hkare.hkare_backend.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipientTypeAndRecipientIdOrderByCreatedAtDesc(
        Notification.RecipientType recipientType, 
        String recipientId
    );
    
    List<Notification> findByRecipientTypeAndRecipientIdAndIsReadOrderByCreatedAtDesc(
        Notification.RecipientType recipientType, 
        String recipientId,
        boolean isRead
    );
    
    List<Notification> findByRecipientTypeOrderByCreatedAtDesc(Notification.RecipientType recipientType);
    List<Notification> findByIsReadOrderByCreatedAtDesc(boolean isRead);
    List<Notification> findBySenderUsernameOrderByCreatedAtDesc(String senderUsername);
    List<Notification> findByPriorityOrderByCreatedAtDesc(String priority);
} 