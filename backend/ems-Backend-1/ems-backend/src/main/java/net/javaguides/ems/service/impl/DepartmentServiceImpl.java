package net.javaguides.ems.service.impl;

import lombok.AllArgsConstructor;
import net.javaguides.ems.dto.DepartmentDto;
import net.javaguides.ems.entity.Department;
import net.javaguides.ems.exception.ResourceNoFoundException;
import net.javaguides.ems.mapper.DepartmentMapper;
import net.javaguides.ems.repository.DepartmentRepository;
import net.javaguides.ems.service.DepartmentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Transactional
public class DepartmentServiceImpl implements DepartmentService {

    private DepartmentRepository departmentRepository;

    @Override
    public DepartmentDto createDepartment(DepartmentDto departmentDto) {
        if (departmentRepository.existsByName(departmentDto.getName())) {
            throw new RuntimeException("Department with name '" + departmentDto.getName() + "' already exists");
        }

        Department department = DepartmentMapper.mapToDepartment(departmentDto);
        Department savedDepartment = departmentRepository.save(department);
        return DepartmentMapper.mapToDepartmentDto(savedDepartment);
    }

    @Override
    public DepartmentDto getDepartmentById(Long departmentId) {
        Department department = departmentRepository.findById(departmentId)
            .orElseThrow(() -> new ResourceNoFoundException("Department not found with id: " + departmentId));
        return DepartmentMapper.mapToDepartmentDto(department);
    }

    @Override
    public List<DepartmentDto> getAllDepartments() {
        List<Department> departments = departmentRepository.findAll();
        return departments.stream()
            .map(DepartmentMapper::mapToDepartmentDto)
            .collect(Collectors.toList());
    }

    @Override
    public DepartmentDto updateDepartment(Long departmentId, DepartmentDto updatedDepartment) {
        Department department = departmentRepository.findById(departmentId)
            .orElseThrow(() -> new ResourceNoFoundException("Department not found with id: " + departmentId));

        // Check if new name already exists (excluding current department)
        if (!department.getName().equals(updatedDepartment.getName()) &&
            departmentRepository.existsByName(updatedDepartment.getName())) {
            throw new RuntimeException("Department with name '" + updatedDepartment.getName() + "' already exists");
        }

        department.setName(updatedDepartment.getName());
        department.setDescription(updatedDepartment.getDescription());

        Department updatedDepartmentObj = departmentRepository.save(department);
        return DepartmentMapper.mapToDepartmentDto(updatedDepartmentObj);
    }

    @Override
    public void deleteDepartment(Long departmentId) {
        Department department = departmentRepository.findById(departmentId)
            .orElseThrow(() -> new ResourceNoFoundException("Department not found with id: " + departmentId));

        if (department.getEmployees() != null && !department.getEmployees().isEmpty()) {
            throw new RuntimeException("Cannot delete department with existing employees");
        }

        departmentRepository.delete(department);
    }
}
