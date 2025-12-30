package net.javaguides.ems.service;

import net.javaguides.ems.dto.CreateUserRequest;
import net.javaguides.ems.dto.UserDto;

import java.util.List;

public interface UserService {
    UserDto createUser(CreateUserRequest createUserRequest);
    List<UserDto> getAllUsers();
    UserDto getUserById(Long id);
    UserDto updateUser(Long id, UserDto userDto);
    void deleteUser(Long id);
}
