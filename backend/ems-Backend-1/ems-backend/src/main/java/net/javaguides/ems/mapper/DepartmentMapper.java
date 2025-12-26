package net.javaguides.ems.mapper;

import net.javaguides.ems.dto.DepartmentDto;
import net.javaguides.ems.entity.Department;

public class DepartmentMapper {

    public static DepartmentDto mapToDepartmentDto(Department department) {
        return new DepartmentDto(
            department.getId(),
            department.getName(),
            department.getDescription(),
            department.getCreatedAt(),
            department.getUpdatedAt(),
            department.getEmployees() != null ? department.getEmployees().size() : 0
        );
    }

    public static Department mapToDepartment(DepartmentDto departmentDto) {
        Department department = new Department();
        department.setId(departmentDto.getId());
        department.setName(departmentDto.getName());
        department.setDescription(departmentDto.getDescription());
        return department;
    }
}
