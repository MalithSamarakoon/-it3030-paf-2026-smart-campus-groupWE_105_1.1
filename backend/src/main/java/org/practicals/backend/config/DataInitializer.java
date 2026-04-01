package org.practicals.backend.config;

import org.practicals.backend.model.userManagement.Role;
import org.practicals.backend.model.userManagement.User;
import org.practicals.backend.repository.userManagement.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Check if an admin user already exists to avoid duplicates
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");

            // Meets the 8-character + special character rules you defined
            admin.setPassword(passwordEncoder.encode("Admin@SmartCampus2026"));

            admin.setEmail("admin@smartcampus.lk");
            admin.setRole(Role.ROLE_ADMIN); // Setting the single Role enum

            userRepository.save(admin);
            System.out.println("Default Admin account created successfully.");
        }
    }
}
