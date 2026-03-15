package com.projet.suiviprojets.controllers;

import com.projet.suiviprojets.dto.ProjetDTO;
import com.projet.suiviprojets.entities.Projet;
import com.projet.suiviprojets.services.ProjetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/projets")
@Tag(name = "Phase 6 : Gestion des Projets")
public class ProjetController {

    @Autowired private ProjetService projetService;

    @PostMapping
    @Operation(summary = "Créer un projet")
    public ResponseEntity<Projet> create(@Valid @RequestBody ProjetDTO dto) {
        return new ResponseEntity<>(projetService.save(dto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Modifier un projet")
    public ResponseEntity<Projet> update(@PathVariable Long id, @Valid @RequestBody ProjetDTO dto) {
        return ResponseEntity.ok(projetService.update(id, dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Projet> getById(@PathVariable Long id) {
        return ResponseEntity.ok(projetService.findById(id));
    }

    @GetMapping
    public ResponseEntity<List<Projet>> getAll() {
        return ResponseEntity.ok(projetService.findAll());
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Suppression sous condition (pas de phases)")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        projetService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/resume")
    @Operation(summary = "Consultation détaillée (Résumé)")
    public ResponseEntity<Projet> getResume(@PathVariable Long id) {
        // Le résumé peut être l'objet complet avec ses phases chargées
        return ResponseEntity.ok(projetService.findById(id));
    }
}


