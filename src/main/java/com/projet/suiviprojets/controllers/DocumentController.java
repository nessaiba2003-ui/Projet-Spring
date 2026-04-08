package com.projet.suiviprojets.controllers;

import com.projet.suiviprojets.entities.Document;
import com.projet.suiviprojets.services.DocumentService;
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
@Tag(name = "Phase 10 : Gestion des Documents")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @Operation(summary = "Enregistrer un document technique pour un projet")
    @PostMapping("/projets/{projetId}/documents")
    public ResponseEntity<Document> save(@PathVariable Long projetId, @Valid  @RequestBody Document document) {
        Document saved = documentService.save(projetId, document);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @Operation(summary = "Lister tous les documents d'un projet")
    @GetMapping("/projets/{projetId}/documents")
    public ResponseEntity<List<Document>> getByProjet(@PathVariable Long projetId) {
        return new ResponseEntity<>(documentService.findByProjetId(projetId), HttpStatus.OK);
    }

    @Operation(summary = "Consulter un document par son ID")
    @GetMapping("/documents/{id}")
    public ResponseEntity<Document> getById(@PathVariable Long id) {
        Document doc = documentService.findById(id);
        return (doc != null) ? ResponseEntity.ok(doc) : ResponseEntity.notFound().build();
    }

    @Operation(summary = "Modifier les informations d'un document")
    @PutMapping("/documents/{id}")
    public ResponseEntity<Document> update(@PathVariable Long id, @Valid @RequestBody Document document) {
        return ResponseEntity.ok(documentService.update(id, document));
    }

    @Operation(summary = "Supprimer un document technique")
    @DeleteMapping("/documents/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        boolean deleted = documentService.delete(id);
        return deleted ? new ResponseEntity<>(HttpStatus.NO_CONTENT) : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @Operation(summary = "Téléchargement du document (Consultation)")
    @GetMapping("/documents/{id}/download")
    public ResponseEntity<String> download(@PathVariable Long id) {
        Document doc = documentService.findById(id);
        if (doc == null) return ResponseEntity.notFound().build();
        // Le prof demande la consultation/téléchargement, on renvoie le lien du fichier
        return ResponseEntity.ok("Fichier prêt au téléchargement : " + doc.getCheminFichier());
    }
}
