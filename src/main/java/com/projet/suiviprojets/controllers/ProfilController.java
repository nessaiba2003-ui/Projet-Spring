package com.projet.suiviprojets.controllers;

import com.projet.suiviprojets.entities.Profil;
import com.projet.suiviprojets.repositories.ProfilRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profils")
@Tag(name = "Gestion des Profils", description = "API pour gérer les rôles (Admin, Chef de projet, etc.)")
public class ProfilController {

    @Autowired
    private ProfilRepository profilRepository;

    @Operation(summary = "Enregistrer un nouveau profil")
    @PostMapping
    public ResponseEntity<Profil> save(@RequestBody Profil profil) {
        Profil savedProfil = profilRepository.save(profil);
        return new ResponseEntity<>(savedProfil, HttpStatus.CREATED);
    }

    @Operation(summary = "Lister tous les profils")
    @GetMapping
    public ResponseEntity<List<Profil>> findAll() {
        return new ResponseEntity<>(profilRepository.findAll(), HttpStatus.OK);
    }

    @Operation(summary = "Supprimer un profil par son ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (profilRepository.existsById(id)) {
            profilRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
