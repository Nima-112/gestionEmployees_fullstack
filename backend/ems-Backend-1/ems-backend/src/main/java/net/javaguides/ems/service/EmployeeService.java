package net.javaguides.ems.service;

import net.javaguides.ems.dto.EmployeeDto;

import java.util.List;

public interface EmployeeService {
    EmployeeDto creatEmployee(EmployeeDto employeeDto);
    EmployeeDto getEmployeeById(Long employeeId);
    List<EmployeeDto> getAllEmployee();

    EmployeeDto updateEmployee(Long employeeId,EmployeeDto updateEmployee);
    void deleteEmployee(Long employeeId);
}
