package org.practicals.backend.controller.incidentTicket;

import org.practicals.backend.dto.incidentTicket.*;
import org.practicals.backend.security.services.UserDetailsImpl;
import org.practicals.backend.service.incidentTicket.IncidentTicketService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "http://localhost:5173")
public class IncidentTicketController {

    private final IncidentTicketService ticketService;

    public IncidentTicketController(IncidentTicketService ticketService) {
        this.ticketService = ticketService;
    }

    // ==================== TICKET ENDPOINTS ====================

    @PostMapping
    public ResponseEntity<TicketResponse> createTicket(@RequestBody CreateTicketRequest request,
                                                        Authentication authentication) {
        String username = getUsername(authentication);
        TicketResponse response = ticketService.createTicket(request, username);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TicketResponse>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    @GetMapping("/my")
    public ResponseEntity<List<TicketResponse>> getMyTickets(Authentication authentication) {
        String username = getUsername(authentication);
        return ResponseEntity.ok(ticketService.getMyTickets(username));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketResponse> getTicketById(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.getTicketById(id));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<TicketResponse> updateTicketStatus(@PathVariable Long id,
                                                              @RequestBody UpdateTicketStatusRequest request,
                                                              Authentication authentication) {
        String username = getUsername(authentication);
        return ResponseEntity.ok(ticketService.updateTicketStatus(id, request, username));
    }

    @PatchMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TicketResponse> assignTicket(@PathVariable Long id,
                                                       @RequestBody AssignTicketRequest request) {
        return ResponseEntity.ok(ticketService.assignTicket(id, request));
    }

    // ==================== COMMENT ENDPOINTS ====================

    @PostMapping("/{id}/comments")
    public ResponseEntity<CommentResponse> addComment(@PathVariable Long id,
                                                       @RequestBody CommentRequest request,
                                                       Authentication authentication) {
        String username = getUsername(authentication);
        return ResponseEntity.status(HttpStatus.CREATED).body(ticketService.addComment(id, request, username));
    }

    @PutMapping("/{ticketId}/comments/{commentId}")
    public ResponseEntity<CommentResponse> updateComment(@PathVariable Long ticketId,
                                                          @PathVariable Long commentId,
                                                          @RequestBody CommentRequest request,
                                                          Authentication authentication) {
        String username = getUsername(authentication);
        return ResponseEntity.ok(ticketService.updateComment(commentId, request, username));
    }

    @DeleteMapping("/{ticketId}/comments/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable Long ticketId,
                                            @PathVariable Long commentId,
                                            Authentication authentication) {
        String username = getUsername(authentication);
        ticketService.deleteComment(commentId, username);
        return ResponseEntity.ok().build();
    }

    // ==================== HELPER ====================

    private String getUsername(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return userDetails.getUsername();
    }
}
