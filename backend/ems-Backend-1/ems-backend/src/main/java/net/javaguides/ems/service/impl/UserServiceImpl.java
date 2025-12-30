package net.javaguides.ems.service.impl;

import lombok.AllArgsConstructor;
import net.javaguides.ems.dto.CreateUserRequest;
import net.javaguides.ems.dto.UserDto;
import net.javaguides.ems.entity.Employee;
import net.javaguides.ems.entity.Role;
import net.javaguides.ems.entity.RoleName;
import net.javaguides.ems.entity.User;
import net.javaguides.ems.exception.ResourceNoFoundException;
import net.javaguides.ems.mapper.UserMapper;
import net.javaguides.ems.repository.EmployeeRepository;
import net.javaguides.ems.repository.RoleRepository;
import net.javaguides.ems.repository.UserRepository;
import net.javaguides.ems.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private UserRepository userRepository;
    private RoleRepository roleRepository;
    private EmployeeRepository employeeRepository;
    private PasswordEncoder passwordEncoder;

    @Override
    public UserDto createUser(CreateUserRequest createUserRequest) {
        // Check if username exists
        if (userRepository.existsByUsername(createUserRequest.getUsername())) {
            throw new RuntimeException("Username is already taken!");
        }

        // Check if email exists
        if (userRepository.existsByEmail(createUserRequest.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }

        // Create new user
        User user = User.builder()
                .username(createUserRequest.getUsername())
                .email(createUserRequest.getEmail())
                .password(passwordEncoder.encode(createUserRequest.getPassword()))
                .firstName(createUserRequest.getFirstName())
                .lastName(createUserRequest.getLastName())
                .enabled(true)
                .build();

        // Set roles
        Set<Role> roles = new HashSet<>();
        if (createUserRequest.getRoles() != null && !createUserRequest.getRoles().isEmpty()) {
            createUserRequest.getRoles().forEach(roleName -> {
                Role role = roleRepository.findByName(RoleName.valueOf(roleName))
                        .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));
                roles.add(role);
            });
        } else {
            // Default role: EMPLOYEE
            Role employeeRole = roleRepository.findByName(RoleName.ROLE_EMPLOYEE)
                    .orElseThrow(() -> new RuntimeException("Default role not found"));
            roles.add(employeeRole);
        }
        user.setRoles(roles);

        // Link to employee if provided
        if (createUserRequest.getEmployeeId() != null) {
            Employee employee = employeeRepository.findById(createUserRequest.getEmployeeId())
                    .orElseThrow(() -> new ResourceNoFoundException("Employee not found with id: " + createUserRequest.getEmployeeId()));
            employee.setUser(user);
        }

        User savedUser = userRepository.save(user);
        return UserMapper.mapToUserDto(savedUser);
    }

    @Override
    public List<UserDto> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(UserMapper::mapToUserDto)
                .collect(Collectors.toList());
    }

    @Override
    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNoFoundException("User not found with id: " + id));
        return UserMapper.mapToUserDto(user);
    }

    @Override
    public UserDto updateUser(Long id, UserDto userDto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNoFoundException("User not found with id: " + id));

        // Update basic fields
        if (userDto.getFirstName() != null) {
            user.setFirstName(userDto.getFirstName());
        }
        if (userDto.getLastName() != null) {
            user.setLastName(userDto.getLastName());
        }
        if (userDto.getEnabled() != null) {
            user.setEnabled(userDto.getEnabled());
        }

        // Update roles if provided
        if (userDto.getRoles() != null && !userDto.getRoles().isEmpty()) {
            Set<Role> roles = new HashSet<>();
            userDto.getRoles().forEach(roleName -> {
                Role role = roleRepository.findByName(RoleName.valueOf(roleName))
                        .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));
                roles.add(role);
            });
            user.setRoles(roles);
        }

        User updatedUser = userRepository.save(user);
        return UserMapper.mapToUserDto(updatedUser);
    }

    @Override
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNoFoundException("User not found with id: " + id));
        userRepository.delete(user);
    }
}
