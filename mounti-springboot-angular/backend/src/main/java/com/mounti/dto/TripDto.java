package com.mounti.dto;

import com.mounti.entity.Trip;
import jakarta.validation.constraints.*;

import java.time.LocalDateTime;

public class TripDto {
    private String id;
    private String transporterId;
    private String transporterName;
    
    @NotBlank
    private String fromLocation;
    
    @NotBlank
    private String toLocation;
    
    @NotNull
    private LocalDateTime departureDate;
    
    @Min(1)
    @Max(8)
    private Integer availableSeats;
    
    @DecimalMin("0.5")
    @DecimalMax("100.0")
    private Double availableWeightKg;
    
    @DecimalMin("1.0")
    private Double pricePerSeat;
    
    @DecimalMin("1.0")
    private Double pricePerKg;
    
    private String notes;
    private Trip.TripStatus status;
    private LocalDateTime createdAt;
    
    // Constructors
    public TripDto() {}
    
    public TripDto(String id, String transporterId, String transporterName, String fromLocation,
                   String toLocation, LocalDateTime departureDate, Integer availableSeats,
                   Double availableWeightKg, Double pricePerSeat, Double pricePerKg,
                   String notes, Trip.TripStatus status, LocalDateTime createdAt) {
        this.id = id;
        this.transporterId = transporterId;
        this.transporterName = transporterName;
        this.fromLocation = fromLocation;
        this.toLocation = toLocation;
        this.departureDate = departureDate;
        this.availableSeats = availableSeats;
        this.availableWeightKg = availableWeightKg;
        this.pricePerSeat = pricePerSeat;
        this.pricePerKg = pricePerKg;
        this.notes = notes;
        this.status = status;
        this.createdAt = createdAt;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getTransporterId() { return transporterId; }
    public void setTransporterId(String transporterId) { this.transporterId = transporterId; }
    
    public String getTransporterName() { return transporterName; }
    public void setTransporterName(String transporterName) { this.transporterName = transporterName; }
    
    public String getFromLocation() { return fromLocation; }
    public void setFromLocation(String fromLocation) { this.fromLocation = fromLocation; }
    
    public String getToLocation() { return toLocation; }
    public void setToLocation(String toLocation) { this.toLocation = toLocation; }
    
    public LocalDateTime getDepartureDate() { return departureDate; }
    public void setDepartureDate(LocalDateTime departureDate) { this.departureDate = departureDate; }
    
    public Integer getAvailableSeats() { return availableSeats; }
    public void setAvailableSeats(Integer availableSeats) { this.availableSeats = availableSeats; }
    
    public Double getAvailableWeightKg() { return availableWeightKg; }
    public void setAvailableWeightKg(Double availableWeightKg) { this.availableWeightKg = availableWeightKg; }
    
    public Double getPricePerSeat() { return pricePerSeat; }
    public void setPricePerSeat(Double pricePerSeat) { this.pricePerSeat = pricePerSeat; }
    
    public Double getPricePerKg() { return pricePerKg; }
    public void setPricePerKg(Double pricePerKg) { this.pricePerKg = pricePerKg; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    public Trip.TripStatus getStatus() { return status; }
    public void setStatus(Trip.TripStatus status) { this.status = status; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}