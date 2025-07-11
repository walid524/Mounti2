package com.mounti.dto;

import com.mounti.entity.Booking;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class BookingDto {
    private String id;
    private String tripId;
    private String clientId;
    private String clientName;
    private Booking.BookingType bookingType;
    private Integer quantity;
    private Double totalPrice;
    private Booking.BookingStatus status;
    private LocalDateTime createdAt;
    
    // Constructors
    public BookingDto() {}
    
    public BookingDto(String id, String tripId, String clientId, String clientName,
                      Booking.BookingType bookingType, Integer quantity, Double totalPrice,
                      Booking.BookingStatus status, LocalDateTime createdAt) {
        this.id = id;
        this.tripId = tripId;
        this.clientId = clientId;
        this.clientName = clientName;
        this.bookingType = bookingType;
        this.quantity = quantity;
        this.totalPrice = totalPrice;
        this.status = status;
        this.createdAt = createdAt;
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
    
    public Booking.BookingType getBookingType() { return bookingType; }
    public void setBookingType(Booking.BookingType bookingType) { this.bookingType = bookingType; }
    
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    
    public Double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(Double totalPrice) { this.totalPrice = totalPrice; }
    
    public Booking.BookingStatus getStatus() { return status; }
    public void setStatus(Booking.BookingStatus status) { this.status = status; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}