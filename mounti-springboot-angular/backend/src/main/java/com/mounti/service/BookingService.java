package com.mounti.service;

import com.mounti.dto.BookingDto;
import com.mounti.dto.BookingRequest;
import com.mounti.entity.Booking;
import com.mounti.entity.Notification;
import com.mounti.entity.Trip;
import com.mounti.entity.User;
import com.mounti.repository.BookingRepository;
import com.mounti.repository.NotificationRepository;
import com.mounti.repository.TripRepository;
import com.mounti.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    public BookingDto createBooking(BookingRequest bookingRequest, String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Trip trip = tripRepository.findById(bookingRequest.getTripId())
            .orElseThrow(() -> new RuntimeException("Trip not found"));

        // Check availability
        if (bookingRequest.getBookingType() == Booking.BookingType.SEAT) {
            if (bookingRequest.getQuantity() > trip.getAvailableSeats()) {
                throw new RuntimeException("Not enough seats available");
            }
        } else {
            if (bookingRequest.getQuantity() > trip.getAvailableWeightKg()) {
                throw new RuntimeException("Not enough weight capacity available");
            }
        }

        // Calculate price
        double totalPrice = bookingRequest.getBookingType() == Booking.BookingType.SEAT
            ? bookingRequest.getQuantity() * trip.getPricePerSeat()
            : bookingRequest.getQuantity() * trip.getPricePerKg();

        Booking booking = new Booking();
        booking.setId(UUID.randomUUID().toString());
        booking.setTripId(bookingRequest.getTripId());
        booking.setClientId(user.getId());
        booking.setClientName(user.getName());
        booking.setBookingType(bookingRequest.getBookingType());
        booking.setQuantity(bookingRequest.getQuantity());
        booking.setTotalPrice(totalPrice);
        booking.setStatus(Booking.BookingStatus.PENDING);

        Booking savedBooking = bookingRepository.save(booking);

        // Create notification for transporter
        Notification notification = new Notification();
        notification.setId(UUID.randomUUID().toString());
        notification.setUserId(trip.getTransporterId());
        notification.setTitle("New Booking Request");
        notification.setMessage(String.format("%s wants to book %d %s(s) for your trip from %s to %s",
            user.getName(), bookingRequest.getQuantity(),
            bookingRequest.getBookingType().toString().toLowerCase(),
            trip.getFromLocation(), trip.getToLocation()));
        notification.setType(Notification.NotificationType.BOOKING_REQUEST);
        notificationRepository.save(notification);

        return convertToDto(savedBooking);
    }

    public List<BookingDto> getMyBookings(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        List<Booking> bookings = bookingRepository.findByClientId(user.getId());
        return bookings.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    public List<BookingDto> getTripBookings(String tripId, String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Trip trip = tripRepository.findById(tripId)
            .orElseThrow(() -> new RuntimeException("Trip not found"));

        if (!trip.getTransporterId().equals(user.getId())) {
            throw new RuntimeException("You can only view bookings for your own trips");
        }

        List<Booking> bookings = bookingRepository.findByTripId(tripId);
        return bookings.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    public void updateBookingStatus(String id, Booking.BookingStatus status, String email) {
        Booking booking = bookingRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Booking not found"));

        Trip trip = tripRepository.findById(booking.getTripId())
            .orElseThrow(() -> new RuntimeException("Trip not found"));

        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (!trip.getTransporterId().equals(user.getId())) {
            throw new RuntimeException("You can only update bookings for your own trips");
        }

        booking.setStatus(status);
        bookingRepository.save(booking);

        // Create notification for client
        Notification notification = new Notification();
        notification.setId(UUID.randomUUID().toString());
        notification.setUserId(booking.getClientId());
        notification.setTitle("Booking Status Updated");
        notification.setMessage(String.format("Your booking has been %s", status.toString().toLowerCase()));
        notification.setType(Notification.NotificationType.BOOKING_CONFIRMED);
        notificationRepository.save(notification);
    }

    public BookingDto getBookingById(String id) {
        Booking booking = bookingRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Booking not found"));
        return convertToDto(booking);
    }

    private BookingDto convertToDto(Booking booking) {
        return new BookingDto(
            booking.getId(),
            booking.getTripId(),
            booking.getClientId(),
            booking.getClientName(),
            booking.getBookingType(),
            booking.getQuantity(),
            booking.getTotalPrice(),
            booking.getStatus(),
            booking.getCreatedAt()
        );
    }
}