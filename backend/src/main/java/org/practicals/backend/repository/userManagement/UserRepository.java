package org.practicals.backend.repository.userManagement;

import org.practicals.backend.model.userManagement.User;
import org.practicals.backend.model.userManagement.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
    List<User> findByRole(Role role);
    List<User> findByRoleOrderByUsernameAsc(Role role);
}
