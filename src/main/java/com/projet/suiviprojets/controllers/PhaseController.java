package com.projet.suiviprojets.controllers;

import com.projet.suiviprojets.entities.Phase;
import com.projet.suiviprojets.services.PhaseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/phases")
@Tag(name = "Phase 7 : Gestion des Phases")
public class PhaseController {

    @Autowired
    private PhaseService phaseService;

    @Operation(summary = "Enregistrer une nouvelle phase")
    @PostMapping("/save")
    public ResponseEntity<Phase> save(@RequestBody Phase phase) {
        Phase savedPhase = phaseService.save(phase);
        return new ResponseEntity<>(savedPhase, HttpStatus.CREATED);
    }

    @Operation(summary = "Lister toutes les phases")
    @GetMapping("/all")
    public ResponseEntity<List<Phase>> findAll() {
        return new ResponseEntity<>(phaseService.findAll(), HttpStatus.OK);
    }
}

