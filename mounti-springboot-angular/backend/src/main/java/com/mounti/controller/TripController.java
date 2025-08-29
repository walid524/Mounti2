package com.mounti.controller;

import com.mounti.dto.TripDto;
import com.mounti.service.TripService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/trips")
@CrossOrigin(origins = "http://localhost:4200")
public class TripController {

    @Autowired
    private TripService tripService;

    @GetMapping
    public ResponseEntity<List<TripDto>> getAllTrips(
            @RequestParam(required = false) String fromLocation,
            @RequestParam(required = false) String toLocation,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime departureDate) {
        
        List<TripDto> trips = tripService.searchTrips(fromLocation, toLocation, departureDate);
        return ResponseEntity.ok(trips);
    }

    @GetMapping("/my")
    public ResponseEntity<List<TripDto>> getMyTrips(Authentication authentication) {
        String email = authentication.getName();
        List<TripDto> trips = tripService.getMyTrips(email);
        return ResponseEntity.ok(trips);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TripDto> getTripById(@PathVariable String id) {
        TripDto trip = tripService.getTripById(id);
        return ResponseEntity.ok(trip);
    }

    @PostMapping
    public ResponseEntity<TripDto> createTrip(
            @Valid @RequestBody TripDto tripDto,
            Authentication authentication) {
        String email = authentication.getName();
        TripDto createdTrip = tripService.createTrip(tripDto, email);
        return ResponseEntity.ok(createdTrip);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TripDto> updateTrip(
            @PathVariable String id,
            @Valid @RequestBody TripDto tripDto,
            Authentication authentication) {
        String email = authentication.getName();
        TripDto updatedTrip = tripService.updateTrip(id, tripDto, email);
        return ResponseEntity.ok(updatedTrip);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTrip(@PathVariable String id, Authentication authentication) {
        String email = authentication.getName();
        tripService.deleteTrip(id, email);
        return ResponseEntity.ok().build();
    }
}