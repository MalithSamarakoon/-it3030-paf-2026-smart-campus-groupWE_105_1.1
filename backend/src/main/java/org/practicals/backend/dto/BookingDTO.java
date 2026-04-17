package org.practicals.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.practicals.backend.model.booking.BookingStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
public class BookingDTO {

    private Long id;

    // --- Request fields (required on creation) ---

    @NotNull(message = "Resource ID is required")
    private Long resourceId;

    private String resourceName; // Populated in response

    private String resourceLocation; // Populated in response

    @NotNull(message = "Date is required")
    private LocalDate date;

    @NotNull(message = "Start time is required")
    private LocalTime startTime;

    @NotNull(message = "End time is required")
    private LocalTime endTime;

    @NotBlank(message = "Purpose is required")
    private String purpose;

    @Min(value = 1, message = "Attendees must be at least 1")
    private Integer attendees;

    // --- Response / admin fields ---

    private BookingStatus status;

    private String rejectionReason;

    private String username; // The user who created the booking

    private LocalDateTime createdAt;
}
