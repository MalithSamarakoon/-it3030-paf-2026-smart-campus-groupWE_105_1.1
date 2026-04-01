package org.practicals.backend.service.userManagement;

import org.practicals.backend.dto.userManagement.RegistrationRequest;
import org.practicals.backend.dto.userManagement.UserResponse;
import org.practicals.backend.exception.ResourceNotFoundException;
import org.practicals.backend.model.userManagement.Role;
import org.practicals.backend.model.userManagement.User;
import org.practicals.backend.repository.userManagement.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UserResponse registerStudent(RegistrationRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username is already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already in use");
        }

        if (request.getPhoneNumber() == null || !request.getPhoneNumber().matches("^\\d{10}$")) {
            throw new IllegalArgumentException("Phone number must be exactly 10 digits.");
        }

        if (!isEmailValid(request.getEmail())) {
            throw new IllegalArgumentException("Email must start with 'it' or 'IT' and contain a valid '@' symbol.");
        }


        if (!isPasswordValid(request.getPassword())) {
            throw new IllegalArgumentException("Password must be at least 8 characters long, " +
                    "contain an uppercase letter, a lowercase letter, a digit, and a special character.");
        }


        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());


        user.setPassword(passwordEncoder.encode(request.getPassword()));


        user.setRole(Role.ROLE_STUDENT);


        User savedUser = userRepository.save(user);


        return mapToUserResponse(savedUser);
    }


    private boolean isEmailValid(String email) {
        if (email == null) return false;
        // Regex: Case-insensitive 'it' at the start, followed by anything, and must have '@'
        String emailPattern = "^(?i)it.*@my\\.sliit\\.lk$";
        return email.matches(emailPattern);
    }

    private boolean isPasswordValid(String password) {
        if (password == null) return false;
        // Rules: Min 8 chars, 1 Upper, 1 Lower, 1 Digit, 1 Special [cite: 198-200]
        String passwordPattern = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\\S+$).{8,}$";
        return password.matches(passwordPattern);
    }

    private UserResponse mapToUserResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setPhoneNumber(user.getPhoneNumber());
        response.setRole(user.getRole());
        return response;
    }

    public UserResponse getUserProfileByUsername(String username) {
        // Uses your custom ResourceNotFoundException [cite: 14]
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

        return mapToUserResponse(user);
    }
}
