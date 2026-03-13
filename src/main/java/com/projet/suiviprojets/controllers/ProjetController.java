package com.projet.suiviprojets.controllers;

import com.projet.suiviprojets.entities.Projet;
import com.projet.suiviprojets.services.ProjetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projets")
@Tag(name = "Phase 5 : Suivi des Projets", description = "API pour la création et la consultation des projets")
public class ProjetController {

    @Autowired
    private ProjetService projetService;

    @Operation(summary = "Créer ou mettre à jour un projet")
    @PostMapping("/save")
    public ResponseEntity<Projet> save(@RequestBody Projet projet) {
        Projet projetEnregistre = projetService.enregistrer(projet);
        return new ResponseEntity<>(projetEnregistre, HttpStatus.CREATED);
    }

    @Operation(summary = "Supprimer un projet par son identifiant")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        boolean estSupprime = projetService.supprimer(id);
        return estSupprime ? new ResponseEntity<>(HttpStatus.NO_CONTENT) : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @Operation(summary = "Récupérer la liste complète des projets")
    @GetMapping("/all")
    public ResponseEntity<List<Projet>> findAll() {
        return new ResponseEntity<>(projetService.listerTout(), HttpStatus.OK);
    }

    @Operation(summary = "Rechercher un projet par son titre")
    @GetMapping("/search")
    public ResponseEntity<List<Projet>> findByTitre(@RequestParam String titre) {
        return new ResponseEntity<>(projetService.rechercherParTitre(titre), HttpStatus.OK);
    }
}

