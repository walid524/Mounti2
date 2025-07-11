package com.mounti.repository;

import com.mounti.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, String> {
    
    List<Notification> findByUserId(String userId);
    
    List<Notification> findByUserIdOrderByCreatedAtDesc(String userId);
    
    @Query("SELECT n FROM Notification n WHERE n.userId = :userId " +
           "AND n.isRead = :isRead " +
           "ORDER BY n.createdAt DESC")
    List<Notification> findByUserIdAndIsRead(@Param("userId") String userId,
                                           @Param("isRead") Boolean isRead);
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.userId = :userId " +
           "AND n.isRead = false")
    Long countUnreadNotifications(@Param("userId") String userId);
    
    @Query("SELECT n FROM Notification n WHERE n.userId = :userId " +
           "AND n.type = :type " +
           "ORDER BY n.createdAt DESC")
    List<Notification> findByUserIdAndType(@Param("userId") String userId,
                                          @Param("type") Notification.NotificationType type);
}