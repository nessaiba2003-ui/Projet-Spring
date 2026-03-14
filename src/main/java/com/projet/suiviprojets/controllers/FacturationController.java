package com.projet.suiviprojets.controllers;

import com.projet.suiviprojets.entities.Facture;
import com.projet.suiviprojets.services.FacturationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class FacturationController {

    @Autowired
    private FacturationService factureService;

    // POST /api/phases/{phaseId}/facture
    @PostMapping("/phases/{phaseId}/facture")
    public ResponseEntity<Facture> create(@PathVariable Long phaseId, @RequestBody Facture facture) {
        return new ResponseEntity<>(factureService.save(phaseId, facture), HttpStatus.CREATED);
    }

    // GET /api/factures
    @GetMapping("/factures")
    public ResponseEntity<List<Facture>> getAll() {
        return ResponseEntity.ok(factureService.findAll());
    }

    // GET /api/factures/{id}
    @GetMapping("/factures/{id}")
    public ResponseEntity<Facture> getById(@PathVariable Long id) {
        return ResponseEntity.ok(factureService.findById(id));
    }

    // DELETE /api/factures/{id}
    @DeleteMapping("/factures/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        factureService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

