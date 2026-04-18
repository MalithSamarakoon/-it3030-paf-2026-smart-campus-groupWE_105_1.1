package org.practicals.backend.dto.userManagement;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TechnicianOptionResponse {
    private Long id;
    private String username;
    private String email;
    private String technicianType;
}
