package org.practicals.backend.dto.userManagement;

import lombok.Data;
import java.util.List;


@Data
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String username;
    private String email;
    private String phoneNumber;
    private List<String> roles;

    public JwtResponse(String accessToken, Long id, String username, String email, String phoneNumber, List<String> roles) {
        this.token = accessToken;
        this.id = id;
        this.username = username;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.roles = roles;
    }
}
