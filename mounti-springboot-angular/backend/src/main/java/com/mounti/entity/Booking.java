package com.mounti.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@EntityListeners(AuditingEntityListener.class)
public class Booking {
    @Id
    private String id;
    
    @NotBlank
    @Column(name = "trip_id")
    private String tripId;
    
    @NotBlank
    @Column(name = "client_id")
    private String clientId;
    
    @NotBlank
    @Column(name = "client_name")
    private String clientName;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "booking_type")
    private BookingType bookingType;
    
    @Min(1)
    private Integer quantity;
    
    @DecimalMin("0.01")
    @Column(name = "total_price")
    private Double totalPrice;
    
    @Enumerated(EnumType.STRING)
    private BookingStatus status = BookingStatus.PENDING;
    
    @CreatedDate
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", insertable = false, updatable = false)
    private Trip trip;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", insertable = false, updatable = false)
    private User client;
    
    // Constructors
    public Booking() {}
    
    public Booking(String tripId, String clientId, String clientName, 
                   BookingType bookingType, Integer quantity, Double totalPrice) {
        this.tripId = tripId;
        this.clientId = clientId;
        this.clientName = clientName;
        this.bookingType = bookingType;
        this.quantity = quantity;
        this.totalPrice = totalPrice;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getTripId() { return tripId; }
    public void setTripId(String tripId) { this.tripId = tripId; }
    
    public String getClientId() { return clientId; }
    public void setClientId(String clientId) { this.clientId = clientId; }
    
    public String getClientName() { return clientName; }
    public void setClientName(String clientName) { this.clientName = clientName; }
    
    public BookingType getBookingType() { return bookingType; }
    public void setBookingType(BookingType bookingType) { this.bookingType = bookingType; }
    
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    
    public Double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(Double totalPrice) { this.totalPrice = totalPrice; }
    
    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public Trip getTrip() { return trip; }
    public void setTrip(Trip trip) { this.trip = trip; }
    
    public User getClient() { return client; }
    public void setClient(User client) { this.client = client; }
    
    public enum BookingType {
        SEAT, PARCEL
    }
    
    public enum BookingStatus {
        PENDING, CONFIRMED, CANCELLED
    }
}