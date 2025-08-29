package com.mounti.controller;

import com.mounti.dto.BookingDto;
import com.mounti.dto.BookingRequest;
import com.mounti.entity.Booking;
import com.mounti.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/bookings")
@CrossOrigin(origins = "http://localhost:4200")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingDto> createBooking(
            @Valid @RequestBody BookingRequest bookingRequest,
            Authentication authentication) {
        String email = authentication.getName();
        BookingDto booking = bookingService.createBooking(bookingRequest, email);
        return ResponseEntity.ok(booking);
    }

    @GetMapping("/my")
    public ResponseEntity<List<BookingDto>> getMyBookings(Authentication authentication) {
        String email = authentication.getName();
        List<BookingDto> bookings = bookingService.getMyBookings(email);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/trip/{tripId}")
    public ResponseEntity<List<BookingDto>> getTripBookings(
            @PathVariable String tripId,
            Authentication authentication) {
        String email = authentication.getName();
        List<BookingDto> bookings = bookingService.getTripBookings(tripId, email);
        return ResponseEntity.ok(bookings);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateBookingStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> statusUpdate,
            Authentication authentication) {
        String email = authentication.getName();
        String status = statusUpdate.get("status");
        bookingService.updateBookingStatus(id, Booking.BookingStatus.valueOf(status.toUpperCase()), email);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingDto> getBookingById(@PathVariable String id) {
        BookingDto booking = bookingService.getBookingById(id);
        return ResponseEntity.ok(booking);
    }
}