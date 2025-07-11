-- Insert Users (password is BCrypt encoded 'password123')
INSERT INTO users (id, email, password, name, is_transporter, created_at) VALUES 
('1', 'transporter@mounti.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IXfYUZdYoTNxD7mxC8xL8yAP7J/fH6', 'Ahmed Ben Ali', true, NOW()),
('2', 'client@mounti.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IXfYUZdYoTNxD7mxC8xL8yAP7J/fH6', 'Fatima Trabelsi', false, NOW()),
('3', 'transporter2@mounti.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IXfYUZdYoTNxD7mxC8xL8yAP7J/fH6', 'Mohamed Chakroun', true, NOW()),
('4', 'client2@mounti.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IXfYUZdYoTNxD7mxC8xL8yAP7J/fH6', 'Leila Bouaziz', false, NOW()),
('5', 'transporter3@mounti.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IXfYUZdYoTNxD7mxC8xL8yAP7J/fH6', 'Karim Benaissa', true, NOW());

-- Insert Trips
INSERT INTO trips (id, transporter_id, transporter_name, from_location, to_location, departure_date, available_seats, available_weight_kg, price_per_seat, price_per_kg, notes, status, created_at) VALUES 
('1', '1', 'Ahmed Ben Ali', 'Tunis, Tunisia', 'Paris, France', '2025-07-20 14:00:00', 3, 25.0, 150.0, 8.0, 'Direct flight, reliable service', 'ACTIVE', NOW()),
('2', '1', 'Ahmed Ben Ali', 'Sfax, Tunisia', 'Lyon, France', '2025-07-22 10:30:00', 2, 15.0, 120.0, 10.0, 'Small parcels only', 'ACTIVE', NOW()),
('3', '3', 'Mohamed Chakroun', 'Sousse, Tunisia', 'Marseille, France', '2025-07-25 16:00:00', 4, 30.0, 140.0, 7.0, 'Weekend trip, flexible timing', 'ACTIVE', NOW()),
('4', '5', 'Karim Benaissa', 'Monastir, Tunisia', 'Nice, France', '2025-07-28 09:00:00', 1, 20.0, 180.0, 9.0, 'Premium service, careful handling', 'ACTIVE', NOW()),
('5', '3', 'Mohamed Chakroun', 'Bizerte, Tunisia', 'Toulouse, France', '2025-08-01 12:00:00', 3, 18.0, 130.0, 8.5, 'Monthly regular trip', 'ACTIVE', NOW()),
('6', '1', 'Ahmed Ben Ali', 'Gabes, Tunisia', 'Bordeaux, France', '2025-08-05 08:00:00', 2, 22.0, 160.0, 7.5, 'Business trip', 'ACTIVE', NOW());

-- Insert Bookings
INSERT INTO bookings (id, trip_id, client_id, client_name, booking_type, quantity, total_price, status, created_at) VALUES 
('1', '1', '2', 'Fatima Trabelsi', 'SEAT', 1, 150.0, 'CONFIRMED', NOW()),
('2', '1', '4', 'Leila Bouaziz', 'PARCEL', 5, 40.0, 'PENDING', NOW()),
('3', '2', '2', 'Fatima Trabelsi', 'PARCEL', 3, 30.0, 'CONFIRMED', NOW()),
('4', '3', '4', 'Leila Bouaziz', 'SEAT', 2, 280.0, 'CONFIRMED', NOW()),
('5', '4', '2', 'Fatima Trabelsi', 'SEAT', 1, 180.0, 'PENDING', NOW()),
('6', '5', '4', 'Leila Bouaziz', 'PARCEL', 8, 68.0, 'CONFIRMED', NOW());

-- Insert Notifications
INSERT INTO notifications (id, user_id, title, message, type, is_read, created_at) VALUES 
('1', '1', 'New Booking Request', 'Fatima Trabelsi wants to book 1 seat for your trip from Tunis to Paris', 'BOOKING_REQUEST', false, NOW()),
('2', '2', 'Booking Confirmed', 'Your booking for Tunis to Paris trip has been confirmed', 'BOOKING_CONFIRMED', false, NOW()),
('3', '1', 'New Parcel Request', 'Leila Bouaziz wants to send 5kg parcel on your Tunis to Paris trip', 'BOOKING_REQUEST', true, NOW()),
('4', '4', 'Booking Confirmed', 'Your booking for Sousse to Marseille trip has been confirmed', 'BOOKING_CONFIRMED', false, NOW()),
('5', '3', 'New Booking Request', 'Leila Bouaziz wants to book 2 seats for your trip from Sousse to Marseille', 'BOOKING_REQUEST', false, NOW()),
('6', '2', 'Trip Reminder', 'Your trip from Sfax to Lyon is scheduled for tomorrow', 'TRIP_REMINDER', false, NOW()),
('7', '1', 'Payment Received', 'Payment received for booking from Fatima Trabelsi', 'PAYMENT_RECEIVED', true, NOW()),
('8', '4', 'New Trip Available', 'A new trip from Monastir to Nice is available for booking', 'TRIP_AVAILABLE', false, NOW());