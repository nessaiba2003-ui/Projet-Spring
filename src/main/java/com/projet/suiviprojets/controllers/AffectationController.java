package com.projet.suiviprojets.controllers;

import com.projet.suiviprojets.dto.AffectationDTO;
import com.projet.suiviprojets.entities.Affectation;
import com.projet.suiviprojets.services.AffectationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@Tag(name = "Phase 8 : Gestion des Affectations")
public class AffectationController {

    @Autowired
    private AffectationService service;

    @Operation(summary = "Affecter un employé à une phase")
    @PostMapping("/phases/{phaseId}/employes/{employeId}")
    public ResponseEntity<AffectationDTO> save(@PathVariable Long phaseId, @PathVariable Long employeId, @Valid @RequestBody AffectationDTO dto) {
        return new ResponseEntity<>(service.save(phaseId, employeId, dto), HttpStatus.CREATED);
    }

    @Operation(summary = "Lister les employés d'une phase")
    @GetMapping("/phases/{phaseId}/employes")
    public ResponseEntity<List<Affectation>> getByPhase(@PathVariable Long phaseId) {
        return ResponseEntity.ok(service.findByPhase(phaseId));
    }

    @Operation(summary = "Retirer un employé d'une phase")
    @DeleteMapping("/phases/{phaseId}/employes/{employeId}")
    public ResponseEntity<Void> delete(@PathVariable Long phaseId, @PathVariable Long employeId) {
        service.delete(phaseId, employeId);
        return ResponseEntity.noContent().build();
    }
}

