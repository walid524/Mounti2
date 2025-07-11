package com.mounti.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "trips")
@EntityListeners(AuditingEntityListener.class)
public class Trip {
    @Id
    private String id;
    
    @NotBlank
    @Column(name = "transporter_id")
    private String transporterId;
    
    @NotBlank
    @Column(name = "transporter_name")
    private String transporterName;
    
    @NotBlank
    @Column(name = "from_location")
    private String fromLocation;
    
    @NotBlank
    @Column(name = "to_location")
    private String toLocation;
    
    @NotNull
    @Column(name = "departure_date")
    private LocalDateTime departureDate;
    
    @Min(1)
    @Max(8)
    @Column(name = "available_seats")
    private Integer availableSeats;
    
    @DecimalMin("0.5")
    @DecimalMax("100.0")
    @Column(name = "available_weight_kg")
    private Double availableWeightKg;
    
    @DecimalMin("1.0")
    @Column(name = "price_per_seat")
    private Double pricePerSeat;
    
    @DecimalMin("1.0")
    @Column(name = "price_per_kg")
    private Double pricePerKg;
    
    private String notes;
    
    @Enumerated(EnumType.STRING)
    private TripStatus status = TripStatus.ACTIVE;
    
    @CreatedDate
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transporter_id", insertable = false, updatable = false)
    private User transporter;
    
    @OneToMany(mappedBy = "trip", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Booking> bookings;
    
    // Constructors
    public Trip() {}
    
    public Trip(String transporterId, String transporterName, String fromLocation, 
                String toLocation, LocalDateTime departureDate, Integer availableSeats,
                Double availableWeightKg, Double pricePerSeat, Double pricePerKg, String notes) {
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
    
    public TripStatus getStatus() { return status; }
    public void setStatus(TripStatus status) { this.status = status; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public User getTransporter() { return transporter; }
    public void setTransporter(User transporter) { this.transporter = transporter; }
    
    public List<Booking> getBookings() { return bookings; }
    public void setBookings(List<Booking> bookings) { this.bookings = bookings; }
    
    public enum TripStatus {
        ACTIVE, COMPLETED, CANCELLED
    }
}