package net.javaguides.ems.mapper;

import net.javaguides.ems.dto.EmployeeDto;
import net.javaguides.ems.entity.Employee;
import net.javaguides.ems.entity.Role;

import java.util.Set;
import java.util.stream.Collectors;

public class EmployeeMapper {
    public static EmployeeDto mapToEmployeeDto(Employee employee){
        return new EmployeeDto(
            employee.getId(),
            employee.getFirstName(),
            employee.getLastName(),
            employee.getEmail(),
            employee.getDepartment() != null ? employee.getDepartment().getId() : null,
            employee.getDepartment() != null ? employee.getDepartment().getName() : null,
            employee.getUser() != null ? employee.getUser().getUsername() : null,
            null, // Never expose password in DTO for security reasons
            employee.getUser() != null ? employee.getUser().getRoles().stream()
                .map(role -> role.getName().name())
                .collect(Collectors.toSet()) : null
        );
    }

    public static Employee maptoEmployee(EmployeeDto employeeDto){
        Employee employee = new Employee();
        employee.setId(employeeDto.getId());
        employee.setFirstName(employeeDto.getFirstName());
        employee.setLastName(employeeDto.getLastName());
        employee.setEmail(employeeDto.getEmail());
        // Department will be set separately in the service layer
        return employee;
    }
}
