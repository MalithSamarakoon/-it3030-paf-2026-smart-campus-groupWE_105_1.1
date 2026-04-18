package org.practicals.backend.service.incidentTicket;

import org.practicals.backend.dto.incidentTicket.*;
import org.practicals.backend.exception.ResourceNotFoundException;
import org.practicals.backend.model.incidentTicket.*;
import org.practicals.backend.model.userManagement.Role;
import org.practicals.backend.model.userManagement.User;
import org.practicals.backend.repository.incidentTicket.IncidentTicketRepository;
import org.practicals.backend.repository.incidentTicket.TicketCommentRepository;
import org.practicals.backend.repository.userManagement.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class IncidentTicketService {

    private final IncidentTicketRepository ticketRepository;
    private final TicketCommentRepository commentRepository;
    private final UserRepository userRepository;

    public IncidentTicketService(IncidentTicketRepository ticketRepository,
                                  TicketCommentRepository commentRepository,
                                  UserRepository userRepository) {
        this.ticketRepository = ticketRepository;
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
    }

    // ==================== TICKET OPERATIONS ====================

    @Transactional
    public TicketResponse createTicket(CreateTicketRequest request, String username) {
        User user = findUserByUsername(username);

        IncidentTicket ticket = new IncidentTicket();
        ticket.setTitle(request.getTitle());
        ticket.setDescription(request.getDescription());
        ticket.setCategory(TicketCategory.valueOf(request.getCategory()));
        ticket.setPriority(TicketPriority.valueOf(request.getPriority()));
        ticket.setStatus(TicketStatus.OPEN);
        ticket.setResourceLocation(request.getResourceLocation());
        ticket.setPreferredContact(request.getPreferredContact());
        ticket.setImageData1(request.getImageData1());
        ticket.setImageData2(request.getImageData2());
        ticket.setImageData3(request.getImageData3());
        ticket.setCreatedBy(user);

        IncidentTicket saved = ticketRepository.save(ticket);
        return mapToTicketResponse(saved, false);
    }

    public List<TicketResponse> getAllTickets() {
        return ticketRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(t -> mapToTicketResponse(t, false))
                .collect(Collectors.toList());
    }

    public List<TicketResponse> getMyTickets(String username) {
        User user = findUserByUsername(username);
        return ticketRepository.findByCreatedByIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(t -> mapToTicketResponse(t, false))
                .collect(Collectors.toList());
    }

    public List<TicketResponse> getAssignedTickets(String username) {
        User user = findUserByUsername(username);
        return ticketRepository.findByAssignedToIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(t -> mapToTicketResponse(t, false))
                .collect(Collectors.toList());
    }

    public TicketResponse getTicketById(Long id, String username) {
        IncidentTicket ticket = findTicketById(id);
        User user = findUserByUsername(username);

        boolean isAdmin = user.getRole() == Role.ROLE_ADMIN;
        boolean isStaffAssignee = user.getRole() == Role.ROLE_STAFF
                && ticket.getAssignedTo() != null
                && ticket.getAssignedTo().getId().equals(user.getId());
        boolean isOwner = ticket.getCreatedBy().getId().equals(user.getId());

        if (!isAdmin && !isStaffAssignee && !isOwner) {
            throw new IllegalArgumentException("You are not authorized to view this ticket.");
        }

        return mapToTicketResponse(ticket, true);
    }

    @Transactional
    public TicketResponse updateTicketStatus(Long id, UpdateTicketStatusRequest request, String username) {
        IncidentTicket ticket = findTicketById(id);
        User user = findUserByUsername(username);

        TicketStatus newStatus = TicketStatus.valueOf(request.getStatus());

        // Validate workflow transitions
        validateStatusTransition(ticket, newStatus, user);

        ticket.setStatus(newStatus);

        if (newStatus == TicketStatus.REJECTED && request.getRejectionReason() != null) {
            ticket.setRejectionReason(request.getRejectionReason());
        }

        if (newStatus == TicketStatus.RESOLVED && request.getResolutionNotes() != null) {
            ticket.setResolutionNotes(request.getResolutionNotes());
        }

        IncidentTicket saved = ticketRepository.save(ticket);
        return mapToTicketResponse(saved, true);
    }

    @Transactional
    public TicketResponse assignTicket(Long id, AssignTicketRequest request) {
        IncidentTicket ticket = findTicketById(id);
        User assignee = userRepository.findById(request.getAssignedToUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getAssignedToUserId()));

        if (assignee.getRole() != Role.ROLE_STAFF) {
            throw new IllegalArgumentException("Only technicians can be assigned to tickets.");
        }

        ticket.setAssignedTo(assignee);

        // Automatically move to IN_PROGRESS when assigned
        if (ticket.getStatus() == TicketStatus.OPEN) {
            ticket.setStatus(TicketStatus.IN_PROGRESS);
        }

        IncidentTicket saved = ticketRepository.save(ticket);
        return mapToTicketResponse(saved, true);
    }

    // ==================== COMMENT OPERATIONS ====================

    @Transactional
    public CommentResponse addComment(Long ticketId, CommentRequest request, String username) {
        IncidentTicket ticket = findTicketById(ticketId);
        User user = findUserByUsername(username);

        if (request.getContent() == null || request.getContent().trim().isEmpty()) {
            throw new IllegalArgumentException("Comment content cannot be empty");
        }

        TicketComment comment = new TicketComment();
        comment.setContent(request.getContent().trim());
        comment.setAuthor(user);
        comment.setTicket(ticket);

        TicketComment saved = commentRepository.save(comment);
        return mapToCommentResponse(saved);
    }

    @Transactional
    public CommentResponse updateComment(Long commentId, CommentRequest request, String username) {
        TicketComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + commentId));

        // Only the author can edit their comment
        if (!comment.getAuthor().getUsername().equals(username)) {
            throw new IllegalArgumentException("You can only edit your own comments");
        }

        if (request.getContent() == null || request.getContent().trim().isEmpty()) {
            throw new IllegalArgumentException("Comment content cannot be empty");
        }

        comment.setContent(request.getContent().trim());
        TicketComment saved = commentRepository.save(comment);
        return mapToCommentResponse(saved);
    }

    @Transactional
    public void deleteComment(Long commentId, String username) {
        TicketComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + commentId));

        User user = findUserByUsername(username);

        // Owner or Admin can delete
        boolean isOwner = comment.getAuthor().getUsername().equals(username);
        boolean isAdmin = user.getRole() == Role.ROLE_ADMIN;

        if (!isOwner && !isAdmin) {
            throw new IllegalArgumentException("You can only delete your own comments");
        }

        commentRepository.delete(comment);
    }

    // ==================== HELPER METHODS ====================

    private void validateStatusTransition(IncidentTicket ticket, TicketStatus next, User user) {
        TicketStatus current = ticket.getStatus();
        boolean isAdmin = user.getRole() == Role.ROLE_ADMIN;
        boolean isStaff = user.getRole() == Role.ROLE_STAFF;

        if (isStaff) {
            boolean isAssignedTechnician = ticket.getAssignedTo() != null
                    && ticket.getAssignedTo().getId().equals(user.getId());
            if (!isAssignedTechnician) {
                throw new IllegalArgumentException("You can only update tickets assigned to you.");
            }
        }

        // Admin can reject from any status
        if (next == TicketStatus.REJECTED && isAdmin) {
            return;
        }

        // Valid workflow transitions
        switch (current) {
            case OPEN:
                if (next == TicketStatus.IN_PROGRESS && (isAdmin || isStaff)) return;
                break;
            case IN_PROGRESS:
                if (next == TicketStatus.RESOLVED && (isAdmin || isStaff)) return;
                break;
            case RESOLVED:
                if (next == TicketStatus.CLOSED && isAdmin) return;
                if (next == TicketStatus.IN_PROGRESS && (isAdmin || isStaff)) return; // reopen
                break;
            case CLOSED:
            case REJECTED:
                // No further transitions allowed
                break;
        }

        throw new IllegalArgumentException(
                "Invalid status transition from " + current + " to " + next + " for your role");
    }

    private User findUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
    }

    private IncidentTicket findTicketById(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));
    }

    private TicketResponse mapToTicketResponse(IncidentTicket ticket, boolean includeComments) {
        TicketResponse response = new TicketResponse();
        response.setId(ticket.getId());
        response.setTitle(ticket.getTitle());
        response.setDescription(ticket.getDescription());
        response.setCategory(ticket.getCategory().name());
        response.setPriority(ticket.getPriority().name());
        response.setStatus(ticket.getStatus().name());
        response.setResourceLocation(ticket.getResourceLocation());
        response.setPreferredContact(ticket.getPreferredContact());
        response.setImageData1(ticket.getImageData1());
        response.setImageData2(ticket.getImageData2());
        response.setImageData3(ticket.getImageData3());
        response.setRejectionReason(ticket.getRejectionReason());
        response.setResolutionNotes(ticket.getResolutionNotes());
        response.setCreatedByUsername(ticket.getCreatedBy().getUsername());
        response.setCreatedById(ticket.getCreatedBy().getId());
        response.setCreatedAt(ticket.getCreatedAt());
        response.setUpdatedAt(ticket.getUpdatedAt());

        if (ticket.getAssignedTo() != null) {
            response.setAssignedToUsername(ticket.getAssignedTo().getUsername());
            response.setAssignedToId(ticket.getAssignedTo().getId());
            response.setAssignedToTechnicianType(
                    ticket.getAssignedTo().getTechnicianType() != null
                            ? ticket.getAssignedTo().getTechnicianType().name()
                            : null
            );
        }

        response.setCommentCount(ticket.getComments() != null ? ticket.getComments().size() : 0);

        if (includeComments && ticket.getComments() != null) {
            response.setComments(
                    ticket.getComments().stream()
                            .map(this::mapToCommentResponse)
                            .collect(Collectors.toList())
            );
        }

        return response;
    }

    private CommentResponse mapToCommentResponse(TicketComment comment) {
        CommentResponse response = new CommentResponse();
        response.setId(comment.getId());
        response.setContent(comment.getContent());
        response.setAuthorUsername(comment.getAuthor().getUsername());
        response.setAuthorId(comment.getAuthor().getId());
        response.setCreatedAt(comment.getCreatedAt());
        response.setUpdatedAt(comment.getUpdatedAt());
        return response;
    }
}
