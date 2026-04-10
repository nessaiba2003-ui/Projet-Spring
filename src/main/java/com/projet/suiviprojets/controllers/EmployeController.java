package com.projet.suiviprojets.controllers;

import com.projet.suiviprojets.dto.EmployeRequest;
import com.projet.suiviprojets.entities.Employe;
import com.projet.suiviprojets.services.EmployeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/employes")
@Tag(name = "Phase 5 : Gestion des Employés")
public class EmployeController {

    @Autowired
    private EmployeService employeService;

    @PostMapping("/save")
    @Operation(summary = "POST /api/employes")
    public ResponseEntity<Employe> save(@Valid @RequestBody EmployeRequest dto) {
        return new ResponseEntity<>(employeService.save(dto), HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "GET /api/employes")
    public ResponseEntity<List<Employe>> getAll() {
        return ResponseEntity.ok(employeService.findAll());
    }

    @GetMapping("/chefs-projet")
    @Operation(summary = "Lister les employés avec profil Chef de projet")
    public ResponseEntity<List<Employe>> getChefsProjet() {
        return ResponseEntity.ok(employeService.findChefsDeProjet());
    }

    @GetMapping("/disponibles")
    @Operation(summary = "Recherche de disponibilité")
    public ResponseEntity<List<Employe>> getDisponibles(
            @RequestParam LocalDate dateDebut,
            @RequestParam LocalDate dateFin) {
        return ResponseEntity.ok(employeService.findDisponibles(dateDebut, dateFin));
    }

    @Operation(summary = "Obtenir un employé par son ID")
    @GetMapping("/{id}")
    public ResponseEntity<Employe> getById(@PathVariable Long id) {
        Employe employe = employeService.findById(id);
        if (employe != null) {
            return new ResponseEntity<>(employe, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @Operation(summary = "Modifier les informations d'un employé")
    @PutMapping("/{id}")
    public ResponseEntity<Employe> update(@PathVariable Long id,@Valid @RequestBody EmployeRequest dto) {
        // On vérifie d'abord si l'employé existe avant de modifier
        if (employeService.findById(id) != null) {
            Employe updatedEmploye = employeService.update(id, dto);
            return new ResponseEntity<>(updatedEmploye, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @Operation(summary = "Supprimer un employé par son ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        boolean deleted = employeService.delete(id);
        if (deleted) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}

