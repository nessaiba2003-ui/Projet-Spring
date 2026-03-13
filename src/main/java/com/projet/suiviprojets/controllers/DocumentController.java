package com.projet.suiviprojets.controllers;

import com.projet.suiviprojets.dto.DocumentDTO;
import com.projet.suiviprojets.services.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class DocumentController {
    private final DocumentService service;

    @PostMapping("/projets/{projetId}/documents")
    public DocumentDTO addDocument(@PathVariable Long projetId, @RequestBody DocumentDTO dto) {
        return service.save(projetId, dto);
    }

    @GetMapping("/projets/{projetId}/documents")
    public List<DocumentDTO> getByProjet(@PathVariable Long projetId) {
        return service.getDocumentsByProjet(projetId);
    }

    @DeleteMapping("/documents/{id}")
    public void delete(@PathVariable Long id) {
        // cest la logique de suppression à ajouter
    }
}