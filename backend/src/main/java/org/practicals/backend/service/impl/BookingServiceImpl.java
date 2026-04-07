package org.practicals.backend.service.impl;

import org.practicals.backend.dto.BookingDTO;
import org.practicals.backend.exception.ResourceNotFoundException;
import org.practicals.backend.model.booking.Booking;
import org.practicals.backend.model.booking.BookingStatus;
import org.practicals.backend.model.resource.Resource;
import org.practicals.backend.model.resource.ResourceStatus;
import org.practicals.backend.model.userManagement.Role;
import org.practicals.backend.model.userManagement.User;
import org.practicals.backend.repository.BookingRepository;
import org.practicals.backend.repository.ResourceRepository;
import org.practicals.backend.repository.userManagement.UserRepository;
import org.practicals.backend.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final ResourceRepository resourceRepository;
    private final UserRepository userRepository;

    @Autowired
    public BookingServiceImpl(BookingRepository bookingRepository,
                              ResourceRepository resourceRepository,
                              UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.resourceRepository = resourceRepository;
        this.userRepository = userRepository;
    }

    @Override
    public BookingDTO createBooking(BookingDTO dto, String username) {
        // --- Validate time range ---
        if (!dto.getStartTime().isBefore(dto.getEndTime())) {
            throw new IllegalArgumentException("Start time must be before end time");
        }

        // --- Fetch and validate user ---
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        // --- Fetch and validate resource ---
        Resource resource = resourceRepository.findById(dto.getResourceId())
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + dto.getResourceId()));

        if (resource.getStatus() != ResourceStatus.ACTIVE) {
            throw new IllegalArgumentException("Resource '" + resource.getName() + "' is not currently active");
        }

        // --- Validate attendees vs capacity ---
        if (dto.getAttendees() != null && resource.getCapacity() != null
                && dto.getAttendees() > resource.getCapacity()) {
            throw new IllegalArgumentException(
                    "Attendees (" + dto.getAttendees() + ") exceed resource capacity (" + resource.getCapacity() + ")");
        }

        // --- Conflict Detection ---
        // A booking conflicts if for the same resource + date, not rejected/cancelled,
        // and the time windows overlap: (newStart < existingEnd) AND (newEnd > existingStart)
        List<Booking> conflicts = bookingRepository.findConflictingBookings(
                dto.getResourceId(), dto.getDate(), dto.getStartTime(), dto.getEndTime());

        if (!conflicts.isEmpty()) {
            Booking conflict = conflicts.get(0);
            throw new IllegalArgumentException(
                    "Time slot conflicts with an existing booking from "
                    + conflict.getStartTime() + " to " + conflict.getEndTime());
        }

        // --- Persist booking ---
        Booking booking = new Booking();
        booking.setResource(resource);
        booking.setUser(user);
        booking.setDate(dto.getDate());
        booking.setStartTime(dto.getStartTime());
        booking.setEndTime(dto.getEndTime());
        booking.setPurpose(dto.getPurpose());
        booking.setAttendees(dto.getAttendees());
        booking.setStatus(BookingStatus.PENDING);

        return mapToDTO(bookingRepository.save(booking));
    }

    @Override
    public List<BookingDTO> getBookings(String username, BookingStatus status) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        // ADMIN: return all bookings (optionally filtered by status)
        if (user.getRole() == Role.ROLE_ADMIN) {
            if (status != null) {
                return bookingRepository.findByStatusOrderByCreatedAtDesc(status)
                        .stream().map(this::mapToDTO).collect(Collectors.toList());
            }
            return bookingRepository.findAllByOrderByCreatedAtDesc()
                    .stream().map(this::mapToDTO).collect(Collectors.toList());
        }

        // USER: return only their own bookings
        return bookingRepository.findByUserOrderByCreatedAtDesc(user)
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public BookingDTO getBookingById(Long id) {
        Booking booking = findBookingOrThrow(id);
        return mapToDTO(booking);
    }

    @Override
    public BookingDTO approveBooking(Long id) {
        Booking booking = findBookingOrThrow(id);
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalArgumentException("Only PENDING bookings can be approved");
        }
        booking.setStatus(BookingStatus.APPROVED);
        return mapToDTO(bookingRepository.save(booking));
    }

    @Override
    public BookingDTO rejectBooking(Long id, String rejectionReason) {
        if (rejectionReason == null || rejectionReason.trim().isEmpty()) {
            throw new IllegalArgumentException("Rejection reason is required");
        }
        Booking booking = findBookingOrThrow(id);
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalArgumentException("Only PENDING bookings can be rejected");
        }
        booking.setStatus(BookingStatus.REJECTED);
        booking.setRejectionReason(rejectionReason.trim());
        return mapToDTO(bookingRepository.save(booking));
    }

    @Override
    public BookingDTO cancelBooking(Long id, String username) {
        Booking booking = findBookingOrThrow(id);

        // Ensure the user owns this booking
        if (!booking.getUser().getUsername().equals(username)) {
            throw new IllegalArgumentException("You can only cancel your own bookings");
        }
        if (booking.getStatus() == BookingStatus.CANCELLED || booking.getStatus() == BookingStatus.REJECTED) {
            throw new IllegalArgumentException("Booking is already " + booking.getStatus());
        }

        booking.setStatus(BookingStatus.CANCELLED);
        return mapToDTO(bookingRepository.save(booking));
    }

    // ---- Private Helpers ----

    private Booking findBookingOrThrow(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
    }

    private BookingDTO mapToDTO(Booking booking) {
        BookingDTO dto = new BookingDTO();
        dto.setId(booking.getId());
        dto.setResourceId(booking.getResource().getId());
        dto.setResourceName(booking.getResource().getName());
        dto.setResourceLocation(booking.getResource().getLocation());
        dto.setDate(booking.getDate());
        dto.setStartTime(booking.getStartTime());
        dto.setEndTime(booking.getEndTime());
        dto.setPurpose(booking.getPurpose());
        dto.setAttendees(booking.getAttendees());
        dto.setStatus(booking.getStatus());
        dto.setRejectionReason(booking.getRejectionReason());
        dto.setUsername(booking.getUser().getUsername());
        dto.setCreatedAt(booking.getCreatedAt());
        return dto;
    }
}
