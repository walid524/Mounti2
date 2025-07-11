package com.mounti.repository;

import com.mounti.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TripRepository extends JpaRepository<Trip, String> {
    
    List<Trip> findByTransporterId(String transporterId);
    
    List<Trip> findByStatus(Trip.TripStatus status);
    
    @Query("SELECT t FROM Trip t WHERE t.status = 'ACTIVE' " +
           "AND (:fromLocation IS NULL OR LOWER(t.fromLocation) LIKE LOWER(CONCAT('%', :fromLocation, '%'))) " +
           "AND (:toLocation IS NULL OR LOWER(t.toLocation) LIKE LOWER(CONCAT('%', :toLocation, '%'))) " +
           "AND (:departureDate IS NULL OR DATE(t.departureDate) = DATE(:departureDate)) " +
           "ORDER BY t.departureDate ASC")
    List<Trip> findTripsWithFilters(@Param("fromLocation") String fromLocation,
                                   @Param("toLocation") String toLocation,
                                   @Param("departureDate") LocalDateTime departureDate);
    
    @Query("SELECT t FROM Trip t WHERE t.status = 'ACTIVE' " +
           "AND t.departureDate > :currentDate " +
           "ORDER BY t.departureDate ASC")
    List<Trip> findUpcomingTrips(@Param("currentDate") LocalDateTime currentDate);
    
    @Query("SELECT t FROM Trip t WHERE t.transporterId = :transporterId " +
           "AND t.status = :status " +
           "ORDER BY t.departureDate DESC")
    List<Trip> findByTransporterIdAndStatus(@Param("transporterId") String transporterId,
                                           @Param("status") Trip.TripStatus status);
}