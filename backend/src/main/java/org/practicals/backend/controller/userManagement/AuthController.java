package org.practicals.backend.controller.userManagement;

import jakarta.validation.Valid;
import org.practicals.backend.dto.userManagement.JwtResponse;
import org.practicals.backend.dto.userManagement.LoginRequest;
import org.practicals.backend.dto.userManagement.RegistrationRequest;
import org.practicals.backend.dto.userManagement.UserResponse;
import org.practicals.backend.security.jwt.JwtUtils;
import org.practicals.backend.security.services.UserDetailsImpl;
import org.practicals.backend.service.userManagement.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final UserService userService;


    public AuthController(AuthenticationManager authenticationManager, JwtUtils jwtUtils, UserService userService) {
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegistrationRequest request) {

        userService.registerStudent(request);


        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));


        SecurityContextHolder.getContext().setAuthentication(authentication);


        String jwt = jwtUtils.generateJwtToken(authentication);


        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());


        return ResponseEntity.status(HttpStatus.CREATED).body(new JwtResponse(
                jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                userDetails.getPhoneNumber(),
                roles));
    }


    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {


        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));


        SecurityContextHolder.getContext().setAuthentication(authentication);


        String jwt = jwtUtils.generateJwtToken(authentication);


        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();


        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());


        return ResponseEntity.ok(new JwtResponse(
                jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                userDetails.getPhoneNumber(),
                roles));
    }
}
