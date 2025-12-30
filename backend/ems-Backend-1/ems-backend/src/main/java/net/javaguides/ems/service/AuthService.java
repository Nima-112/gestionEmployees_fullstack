package net.javaguides.ems.service;

import net.javaguides.ems.dto.JwtResponse;
import net.javaguides.ems.dto.LoginRequest;

public interface AuthService {
    JwtResponse login(LoginRequest loginRequest);
}
