package net.javaguides.ems.service.impl;

import lombok.AllArgsConstructor;
import net.javaguides.ems.dto.EmployeeDto;
import net.javaguides.ems.entity.Department;
import net.javaguides.ems.entity.Employee;
import net.javaguides.ems.entity.Role;
import net.javaguides.ems.entity.RoleName;
import net.javaguides.ems.entity.User;
import net.javaguides.ems.exception.ResourceNoFoundException;
import net.javaguides.ems.mapper.EmployeeMapper;
import net.javaguides.ems.repository.DepartmentRepository;
import net.javaguides.ems.repository.EmployeeRepository;
import net.javaguides.ems.repository.RoleRepository;
import net.javaguides.ems.repository.UserRepository;
import net.javaguides.ems.service.EmployeeService;
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
public class EmployeeServiceImpl implements EmployeeService {

    private EmployeeRepository employeeRepository;
    private DepartmentRepository departmentRepository;
    private UserRepository userRepository;
    private RoleRepository roleRepository;
    private PasswordEncoder passwordEncoder;
    @Override
    public EmployeeDto creatEmployee(EmployeeDto employeeDto) {
        // Check if username already exists
        if (employeeDto.getUsername() != null && userRepository.existsByUsername(employeeDto.getUsername())) {
            throw new RuntimeException("Username already exists: " + employeeDto.getUsername());
        }

        // Check if email already exists as user
        if (userRepository.existsByEmail(employeeDto.getEmail())) {
            throw new RuntimeException("Email already registered: " + employeeDto.getEmail());
        }

        Employee employee = EmployeeMapper.maptoEmployee(employeeDto);

        // Set department if departmentId is provided
        if (employeeDto.getDepartmentId() != null) {
            Department department = departmentRepository.findById(employeeDto.getDepartmentId())
                .orElseThrow(() -> new ResourceNoFoundException("Department not found with id: " + employeeDto.getDepartmentId()));
            employee.setDepartment(department);
        }

        // Create user account if username and password are provided
        if (employeeDto.getUsername() != null && employeeDto.getPassword() != null) {
            User user = new User();
            user.setUsername(employeeDto.getUsername());
            user.setEmail(employeeDto.getEmail());
            user.setPassword(passwordEncoder.encode(employeeDto.getPassword()));
            user.setEnabled(true);

            // Set roles
            Set<Role> roles = new HashSet<>();
            if (employeeDto.getRoles() != null && !employeeDto.getRoles().isEmpty()) {
                for (String roleName : employeeDto.getRoles()) {
                    Role role = roleRepository.findByName(RoleName.valueOf(roleName))
                        .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));
                    roles.add(role);
                }
            } else {
                // Default role: EMPLOYEE
                Role defaultRole = roleRepository.findByName(RoleName.ROLE_EMPLOYEE)
                    .orElseThrow(() -> new RuntimeException("Default role ROLE_EMPLOYEE not found"));
                roles.add(defaultRole);
            }
            user.setRoles(roles);

            User savedUser = userRepository.save(user);
            employee.setUser(savedUser);
        }

        Employee savedEmployee = employeeRepository.save(employee);
        return EmployeeMapper.mapToEmployeeDto(savedEmployee);
    }

    @Override
    public EmployeeDto getEmployeeById(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNoFoundException("Employee is not exist with the given id : "+ employeeId));
        return EmployeeMapper.mapToEmployeeDto(employee) ;
    }

    @Override
    public List<EmployeeDto> getAllEmployee() {
        List<Employee> employees = employeeRepository.findAll();
        return employees.stream().map((employee ) -> EmployeeMapper.mapToEmployeeDto(employee)).collect(Collectors.toList());
    }

    @Override
    public EmployeeDto updateEmployee(Long employeeId, EmployeeDto updateEmployee) {
        Employee employee = employeeRepository.findById(employeeId)
            .orElseThrow(() -> new ResourceNoFoundException("Employee not found with id: " + employeeId));

        employee.setFirstName(updateEmployee.getFirstName());
        employee.setLastName(updateEmployee.getLastName());
        employee.setEmail(updateEmployee.getEmail());

        // Update department if departmentId is provided
        if (updateEmployee.getDepartmentId() != null) {
            Department department = departmentRepository.findById(updateEmployee.getDepartmentId())
                .orElseThrow(() -> new ResourceNoFoundException("Department not found with id: " + updateEmployee.getDepartmentId()));
            employee.setDepartment(department);
        } else {
            employee.setDepartment(null);
        }

        Employee updatedEmployeeObj = employeeRepository.save(employee);
        return EmployeeMapper.mapToEmployeeDto(updatedEmployeeObj);
    }

    @Override
    public void deleteEmployee(Long employeeId) {
        Employee employee =  employeeRepository.findById(employeeId).orElseThrow(()-> new ResourceNoFoundException("mployee not Exist whith the given id : "+employeeId));
        employeeRepository.delete(employee);
    }
}
