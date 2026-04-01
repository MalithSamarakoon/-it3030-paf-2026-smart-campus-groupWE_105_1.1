package org.practicals.backend.controller.userManagement;

import jakarta.validation.Valid;
import org.practicals.backend.dto.userManagement.RegistrationRequest;
import org.practicals.backend.dto.userManagement.UserResponse;
import org.practicals.backend.service.userManagement.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")

@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserService userService;

    // Constructor injection is preferred for better testability [cite: 87]
    public AuthController(UserService userService) {
        this.userService = userService;
    }


    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegistrationRequest request) {
        // 1. Call the service to handle business logic and persistence
        UserResponse response = userService.registerStudent(request);

        // 2. Return 201 Created status with the sanitized user data
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}
