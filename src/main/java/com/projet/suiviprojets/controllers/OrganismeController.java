package com.projet.suiviprojets.controllers;

import com.projet.suiviprojets.dto.OrganismeRequestDTO;
import com.projet.suiviprojets.dto.OrganismeResponseDTO;
import com.projet.suiviprojets.services.OrganismeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/*@RestController
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
}*/

import com.projet.suiviprojets.dto.OrganismeRequestDTO;
import com.projet.suiviprojets.dto.OrganismeResponseDTO;
import com.projet.suiviprojets.services.OrganismeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/organismes")
@Tag(name = "Phase 4 : Gestion des Organismes")
public class OrganismeController {

    @Autowired
    private OrganismeService organismeService;

    @Operation(summary = "Enregistrer un organisme")
    @PostMapping
    public ResponseEntity<OrganismeResponseDTO> save(@RequestBody @Valid OrganismeRequestDTO dto) {
        return new ResponseEntity<>(organismeService.save(dto), HttpStatus.CREATED);
    }

    @Operation(summary = "Lister tous les organismes")
    @GetMapping
    public ResponseEntity<List<OrganismeResponseDTO>> getAll() {
        return ResponseEntity.ok(organismeService.findAll());
    }

    @Operation(summary = "Obtenir un organisme par son ID")
    @GetMapping("/{id}")
    public ResponseEntity<OrganismeResponseDTO> getById(@PathVariable Long id) {
        OrganismeResponseDTO res = organismeService.findById(id);
        return res != null ? ResponseEntity.ok(res) : ResponseEntity.notFound().build();
    }

    @Operation(summary = "Modifier un organisme")
    @PutMapping("/{id}")
    public ResponseEntity<OrganismeResponseDTO> update(@PathVariable Long id, @RequestBody @Valid OrganismeRequestDTO dto) {
        OrganismeResponseDTO updated = organismeService.update(id, dto);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @Operation(summary = "Supprimer un organisme")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable @Valid Long id) {
        return organismeService.delete(id) ?
                new ResponseEntity<>(HttpStatus.NO_CONTENT) : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}

