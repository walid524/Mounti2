package com.mounti.repository;

import com.mounti.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, String> {
    
    List<Booking> findByClientId(String clientId);
    
    List<Booking> findByTripId(String tripId);
    
    List<Booking> findByStatus(Booking.BookingStatus status);
    
    @Query("SELECT b FROM Booking b WHERE b.clientId = :clientId " +
           "AND b.status = :status " +
           "ORDER BY b.createdAt DESC")
    List<Booking> findByClientIdAndStatus(@Param("clientId") String clientId,
                                         @Param("status") Booking.BookingStatus status);
    
    @Query("SELECT b FROM Booking b WHERE b.tripId = :tripId " +
           "AND b.status = :status " +
           "ORDER BY b.createdAt ASC")
    List<Booking> findByTripIdAndStatus(@Param("tripId") String tripId,
                                       @Param("status") Booking.BookingStatus status);
    
    @Query("SELECT SUM(b.quantity) FROM Booking b WHERE b.tripId = :tripId " +
           "AND b.bookingType = :bookingType " +
           "AND b.status = 'CONFIRMED'")
    Integer getTotalBookedQuantity(@Param("tripId") String tripId,
                                  @Param("bookingType") Booking.BookingType bookingType);
    
    @Query("SELECT b FROM Booking b JOIN b.trip t WHERE t.transporterId = :transporterId " +
           "ORDER BY b.createdAt DESC")
    List<Booking> findBookingsByTransporterId(@Param("transporterId") String transporterId);
}