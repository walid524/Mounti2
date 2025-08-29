package com.mounti.service;

import com.mounti.dto.TripDto;
import com.mounti.entity.Trip;
import com.mounti.entity.User;
import com.mounti.repository.TripRepository;
import com.mounti.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TripService {

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private UserRepository userRepository;

    public List<TripDto> searchTrips(String fromLocation, String toLocation, LocalDateTime departureDate) {
        List<Trip> trips = tripRepository.findTripsWithFilters(fromLocation, toLocation, departureDate);
        return trips.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    public List<TripDto> getMyTrips(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        List<Trip> trips = tripRepository.findByTransporterId(user.getId());
        return trips.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    public TripDto getTripById(String id) {
        Trip trip = tripRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Trip not found"));
        return convertToDto(trip);
    }

    public TripDto createTrip(TripDto tripDto, String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getIsTransporter()) {
            throw new RuntimeException("Only transporters can create trips");
        }

        Trip trip = new Trip();
        trip.setId(UUID.randomUUID().toString());
        trip.setTransporterId(user.getId());
        trip.setTransporterName(user.getName());
        trip.setFromLocation(tripDto.getFromLocation());
        trip.setToLocation(tripDto.getToLocation());
        trip.setDepartureDate(tripDto.getDepartureDate());
        trip.setAvailableSeats(tripDto.getAvailableSeats());
        trip.setAvailableWeightKg(tripDto.getAvailableWeightKg());
        trip.setPricePerSeat(tripDto.getPricePerSeat());
        trip.setPricePerKg(tripDto.getPricePerKg());
        trip.setNotes(tripDto.getNotes());
        trip.setStatus(Trip.TripStatus.ACTIVE);

        Trip savedTrip = tripRepository.save(trip);
        return convertToDto(savedTrip);
    }

    public TripDto updateTrip(String id, TripDto tripDto, String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Trip trip = tripRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Trip not found"));

        if (!trip.getTransporterId().equals(user.getId())) {
            throw new RuntimeException("You can only update your own trips");
        }

        trip.setFromLocation(tripDto.getFromLocation());
        trip.setToLocation(tripDto.getToLocation());
        trip.setDepartureDate(tripDto.getDepartureDate());
        trip.setAvailableSeats(tripDto.getAvailableSeats());
        trip.setAvailableWeightKg(tripDto.getAvailableWeightKg());
        trip.setPricePerSeat(tripDto.getPricePerSeat());
        trip.setPricePerKg(tripDto.getPricePerKg());
        trip.setNotes(tripDto.getNotes());

        Trip updatedTrip = tripRepository.save(trip);
        return convertToDto(updatedTrip);
    }

    public void deleteTrip(String id, String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Trip trip = tripRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Trip not found"));

        if (!trip.getTransporterId().equals(user.getId())) {
            throw new RuntimeException("You can only delete your own trips");
        }

        tripRepository.delete(trip);
    }

    private TripDto convertToDto(Trip trip) {
        return new TripDto(
            trip.getId(),
            trip.getTransporterId(),
            trip.getTransporterName(),
            trip.getFromLocation(),
            trip.getToLocation(),
            trip.getDepartureDate(),
            trip.getAvailableSeats(),
            trip.getAvailableWeightKg(),
            trip.getPricePerSeat(),
            trip.getPricePerKg(),
            trip.getNotes(),
            trip.getStatus(),
            trip.getCreatedAt()
        );
    }
}