package org.practicals.backend.repository;

import org.practicals.backend.model.booking.Booking;
import org.practicals.backend.model.booking.BookingStatus;
import org.practicals.backend.model.userManagement.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Retrieve all bookings for a specific user (USER role view)
    List<Booking> findByUserOrderByCreatedAtDesc(User user);

    // Retrieve all bookings (ADMIN view), optionally filtered by status
    List<Booking> findAllByOrderByCreatedAtDesc();

    List<Booking> findByStatusOrderByCreatedAtDesc(BookingStatus status);

    /**
     * Conflict Detection Query:
     * A booking conflicts if it is for the same resource on the same date,
     * and is NOT rejected/cancelled, and the time windows overlap.
     * Overlap condition: (newStart < existingEnd) AND (newEnd > existingStart)
     */
    @Query("SELECT b FROM Booking b WHERE b.resource.id = :resourceId " +
           "AND b.date = :date " +
           "AND b.status NOT IN ('REJECTED', 'CANCELLED') " +
           "AND (b.startTime < :endTime AND b.endTime > :startTime)")
    List<Booking> findConflictingBookings(
            @Param("resourceId") Long resourceId,
            @Param("date") LocalDate date,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime);

    // Find bookings by resource and date (for reporting / details)
    List<Booking> findByResourceIdAndDate(Long resourceId, LocalDate date);
}
