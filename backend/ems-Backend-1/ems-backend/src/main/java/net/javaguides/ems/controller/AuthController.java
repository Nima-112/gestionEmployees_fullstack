package net.javaguides.ems.controller;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import net.javaguides.ems.dto.JwtResponse;
import net.javaguides.ems.dto.LoginRequest;
import net.javaguides.ems.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
public class AuthController {

    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        JwtResponse response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }
}
