package com.mounti.dto;

import com.mounti.entity.Booking;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class BookingRequest {
    @NotBlank
    private String tripId;
    
    @NotNull
    private Booking.BookingType bookingType;
    
    @Min(1)
    private Integer quantity;
    
    // Constructors
    public BookingRequest() {}
    
    public BookingRequest(String tripId, Booking.BookingType bookingType, Integer quantity) {
        this.tripId = tripId;
        this.bookingType = bookingType;
        this.quantity = quantity;
    }
    
    // Getters and Setters
    public String getTripId() { return tripId; }
    public void setTripId(String tripId) { this.tripId = tripId; }
    
    public Booking.BookingType getBookingType() { return bookingType; }
    public void setBookingType(Booking.BookingType bookingType) { this.bookingType = bookingType; }
    
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}