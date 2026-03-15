package com.projet.suiviprojets.controllers;

import com.projet.suiviprojets.dto.*;
import com.projet.suiviprojets.entities.Employe;
import com.projet.suiviprojets.repositories.EmployeRepository;
import com.projet.suiviprojets.security.JwtUtils;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Phase 14 : Authentification")
public class AuthController {

    @Autowired AuthenticationManager authenticationManager;
    @Autowired JwtUtils jwtUtils;
    @Autowired EmployeRepository employeRepository;
    @Autowired PasswordEncoder encoder;

    // POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getLogin(), loginRequest.getPassword()));

        String jwt = jwtUtils.generateToken(authentication.getName());
        Map<String, String> response = new HashMap<>();
        response.put("token", jwt);
        return ResponseEntity.ok(response);
    }

    // GET /api/auth/me
    @GetMapping("/me")
    public ResponseEntity<Employe> getMe(Principal principal) {
        return ResponseEntity.ok(employeRepository.findByLogin(principal.getName()).get());
    }

    // POST /api/auth/change-password
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(Principal principal, @RequestBody ChangePasswordRequest request) {
        Employe emp = employeRepository.findByLogin(principal.getName()).get();
        if (!encoder.matches(request.getOldPassword(), emp.getPassword())) {
            return ResponseEntity.badRequest().body("Ancien mot de passe incorrect");
        }
        emp.setPassword(encoder.encode(request.getNewPassword()));
        employeRepository.save(emp);
        return ResponseEntity.ok("Mot de passe modifié avec succès");
    }
}

//Remarques : authenticationManager.authenticate() s'occupe de tout. Elle va :
//Prendre le mot de passe "clair" qu'on tapes dans Postman.
//Le comparer avec le mot de passe "haché" qu'elle trouve dans la base de données grâce à  UserDetailsServiceImpl.