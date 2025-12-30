package net.javaguides.ems.config;

import lombok.AllArgsConstructor;
import net.javaguides.ems.entity.Role;
import net.javaguides.ems.entity.RoleName;
import net.javaguides.ems.entity.User;
import net.javaguides.ems.repository.RoleRepository;
import net.javaguides.ems.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
@AllArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private RoleRepository roleRepository;
    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Initialize roles if they don't exist
        if (roleRepository.count() == 0) {
            Role adminRole = Role.builder().name(RoleName.ROLE_ADMIN).build();
            Role managerRole = Role.builder().name(RoleName.ROLE_MANAGER).build();
            Role employeeRole = Role.builder().name(RoleName.ROLE_EMPLOYEE).build();

            roleRepository.save(adminRole);
            roleRepository.save(managerRole);
            roleRepository.save(employeeRole);

            System.out.println("✓ Roles initialized: ADMIN, MANAGER, EMPLOYEE");
        }

        // Create default admin user if no users exist
        if (userRepository.count() == 0) {
            Role adminRole = roleRepository.findByName(RoleName.ROLE_ADMIN)
                    .orElseThrow(() -> new RuntimeException("Admin role not found"));

            User admin = User.builder()
                    .username("admin")
                    .email("admin@equipepro.com")
                    .password(passwordEncoder.encode("admin123"))
                    .firstName("System")
                    .lastName("Administrator")
                    .roles(Set.of(adminRole))
                    .enabled(true)
                    .build();

            userRepository.save(admin);

            System.out.println("✓ Default admin user created:");
            System.out.println("  Username: admin");
            System.out.println("  Password: admin123");
            System.out.println("  Email: admin@equipepro.com");
        }
    }
}
