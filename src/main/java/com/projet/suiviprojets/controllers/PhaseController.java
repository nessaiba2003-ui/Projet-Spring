package com.projet.suiviprojets.controllers;

import com.projet.suiviprojets.entities.Phase;
import com.projet.suiviprojets.services.PhaseService;
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
@Tag(name = "Phase 7 : Gestion des Phases")
public class PhaseController {

    @Autowired private PhaseService phaseService;

    @PostMapping("/projets/{projetId}/phases")
    public ResponseEntity<Phase> create(@PathVariable Long projetId, @Valid  @RequestBody Phase phase) {
        return new ResponseEntity<>(phaseService.save(projetId, phase), HttpStatus.CREATED);
    }

    @GetMapping("/projets/{projetId}/phases")
    public ResponseEntity<List<Phase>> getByProjet(@PathVariable Long projetId) {
        return ResponseEntity.ok(phaseService.findByProjet(projetId));
    }

    @GetMapping("/phases/{id}")
    public ResponseEntity<Phase> getById(@PathVariable Long id) {
        Phase p = phaseService.findById(id);
        return p != null ? ResponseEntity.ok(p) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/phases/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return phaseService.delete(id) ? new ResponseEntity<>(HttpStatus.NO_CONTENT) : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // Les 3 PATCH pour les changements d'état
    @PatchMapping("/phases/{id}/realisation")
    public ResponseEntity<Phase> patchRealisation(@PathVariable Long id, @RequestParam Boolean etat) {
        return ResponseEntity.ok(phaseService.updateEtat(id, "realisation", etat));
    }

    @PatchMapping("/phases/{id}/facturation")
    public ResponseEntity<Phase> patchFacturation(@PathVariable Long id, @RequestParam Boolean etat) {
        return ResponseEntity.ok(phaseService.updateEtat(id, "facturation", etat));
    }

    @PatchMapping("/phases/{id}/paiement")
    public ResponseEntity<Phase> patchPaiement(@PathVariable Long id, @RequestParam Boolean etat) {
        return ResponseEntity.ok(phaseService.updateEtat(id, "paiement", etat));
    }
}

//toujours @valid pour post et put