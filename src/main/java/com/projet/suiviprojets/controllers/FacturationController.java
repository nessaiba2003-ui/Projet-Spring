package com.projet.suiviprojets.controllers;

import com.projet.suiviprojets.entities.Facture;
import com.projet.suiviprojets.services.FacturationService;
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
@RequestMapping("/api")
@Tag(name = "Gestion des Factures", description = "API pour la facturation des phases (Phase 11)")
public class FacturationController {

    @Autowired
    private FacturationService factureService;

    @Operation(summary = "Enregistrer une facture pour une phase spécifique")
    @PostMapping("/phases/{phaseId}/facture")
    public ResponseEntity<Facture> save(@PathVariable Long phaseId, @Valid  @RequestBody Facture facture) {
        Facture savedFacture = factureService.save(phaseId, facture);
        return new ResponseEntity<>(savedFacture, HttpStatus.CREATED);
    }

    @Operation(summary = "Lister toutes les factures")
    @GetMapping("/factures")
    public ResponseEntity<List<Facture>> findAll() {
        return new ResponseEntity<>(factureService.findAll(), HttpStatus.OK);
    }

    @Operation(summary = "Obtenir une facture par son ID")
    @GetMapping("/factures/{id}")
    public ResponseEntity<Facture> findById(@PathVariable Long id) {
        Facture facture = factureService.findById(id);
        if (facture != null) {
            return new ResponseEntity<>(facture, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @Operation(summary = "Supprimer une facture par son ID")
    @DeleteMapping("/factures/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        boolean deleted = factureService.delete(id);
        if (deleted) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}




