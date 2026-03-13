package com.projet.suiviprojets.controllers;

import com.projet.suiviprojets.dto.OrganismeRequestDTO;
import com.projet.suiviprojets.dto.OrganismeResponseDTO;
import com.projet.suiviprojets.services.OrganismeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/organismes")
@RequiredArgsConstructor
public class OrganismeController {
    private final OrganismeService service;

    @PostMapping
    public OrganismeResponseDTO create(@RequestBody OrganismeRequestDTO dto) {
        return service.save(dto);
    }

    @GetMapping
    public List<OrganismeResponseDTO> getAll() {
        return service.getAll();
    }
}