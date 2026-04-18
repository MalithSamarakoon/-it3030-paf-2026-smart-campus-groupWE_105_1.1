package org.practicals.backend.repository.incidentTicket;

import org.practicals.backend.model.incidentTicket.IncidentTicket;
import org.practicals.backend.model.incidentTicket.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IncidentTicketRepository extends JpaRepository<IncidentTicket, Long> {
    List<IncidentTicket> findByCreatedByIdOrderByCreatedAtDesc(Long userId);
    List<IncidentTicket> findByAssignedToIdOrderByCreatedAtDesc(Long userId);
    List<IncidentTicket> findByStatusOrderByCreatedAtDesc(TicketStatus status);
    List<IncidentTicket> findAllByOrderByCreatedAtDesc();
}
