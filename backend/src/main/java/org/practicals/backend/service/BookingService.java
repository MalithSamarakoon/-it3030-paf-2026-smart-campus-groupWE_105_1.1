package org.practicals.backend.service;

import org.practicals.backend.dto.BookingDTO;
import org.practicals.backend.model.booking.BookingStatus;

import java.util.List;

public interface BookingService {

    BookingDTO createBooking(BookingDTO bookingDTO, String username);

    List<BookingDTO> getBookings(String username, BookingStatus status);

    BookingDTO getBookingById(Long id, String username);

    BookingDTO approveBooking(Long id);

    BookingDTO rejectBooking(Long id, String rejectionReason);

    BookingDTO cancelBooking(Long id, String username);

    BookingDTO updatePendingBooking(Long id, BookingDTO bookingDTO, String username);

    void deletePendingBooking(Long id, String username);
}
