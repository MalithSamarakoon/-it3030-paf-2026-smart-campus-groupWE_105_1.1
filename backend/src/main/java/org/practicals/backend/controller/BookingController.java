package org.practicals.backend.controller;

import jakarta.validation.Valid;
import org.practicals.backend.dto.BookingDTO;
import org.practicals.backend.model.booking.BookingStatus;
import org.practicals.backend.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    @Autowired
    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    /**
     * POST /api/bookings
     * Create a new booking (any authenticated user).
     */
    @PostMapping
    public ResponseEntity<BookingDTO> createBooking(@Valid @RequestBody BookingDTO bookingDTO) {
        String username = getAuthenticatedUsername();
        BookingDTO created = bookingService.createBooking(bookingDTO, username);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    /**
     * GET /api/bookings
     * USER: returns own bookings.
     * ADMIN: returns all bookings, optional ?status= filter.
     */
    @GetMapping
    public ResponseEntity<List<BookingDTO>> getBookings(
            @RequestParam(required = false) BookingStatus status) {
        String username = getAuthenticatedUsername();
        return ResponseEntity.ok(bookingService.getBookings(username, status));
    }

    /**
     * GET /api/bookings/{id}
     * Retrieve a single booking by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<BookingDTO> getBookingById(@PathVariable Long id) {
        String username = getAuthenticatedUsername();
        return ResponseEntity.ok(bookingService.getBookingById(id, username));
    }

    /**
     * PUT /api/bookings/{id}
     * USER: update own pending booking details.
     */
    @PutMapping("/{id}")
    public ResponseEntity<BookingDTO> updateBooking(
            @PathVariable Long id,
            @Valid @RequestBody BookingDTO bookingDTO) {
        String username = getAuthenticatedUsername();
        return ResponseEntity.ok(bookingService.updatePendingBooking(id, bookingDTO, username));
    }

    /**
     * DELETE /api/bookings/{id}
     * USER: delete own pending booking.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
        String username = getAuthenticatedUsername();
        bookingService.deletePendingBooking(id, username);
        return ResponseEntity.noContent().build();
    }

    /**
     * PATCH /api/bookings/{id}/approve
     * ADMIN only: approve a pending booking.
     */
    @PatchMapping("/{id}/approve")
    public ResponseEntity<BookingDTO> approveBooking(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.approveBooking(id));
    }

    /**
     * PATCH /api/bookings/{id}/reject
     * ADMIN only: reject a booking with a reason.
     * Body: { "reason": "..." }
     */
    @PatchMapping("/{id}/reject")
    public ResponseEntity<BookingDTO> rejectBooking(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String reason = body.get("reason");
        return ResponseEntity.ok(bookingService.rejectBooking(id, reason));
    }

    /**
     * PATCH /api/bookings/{id}/cancel
     * USER: cancel their own booking.
     */
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<BookingDTO> cancelBooking(@PathVariable Long id) {
        String username = getAuthenticatedUsername();
        return ResponseEntity.ok(bookingService.cancelBooking(id, username));
    }

    // ---- Helper ----

    private String getAuthenticatedUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }
}
