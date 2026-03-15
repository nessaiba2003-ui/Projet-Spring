package com.projet.suiviprojets.services;

import com.projet.suiviprojets.dto.DocumentDTO;
import com.projet.suiviprojets.entities.Document;
import com.projet.suiviprojets.entities.Projet;
import com.projet.suiviprojets.repositories.DocumentRepository;
import com.projet.suiviprojets.repositories.ProjetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DocumentService {
    private final DocumentRepository documentRepo;
    private final ProjetRepository projetRepo;

    public DocumentDTO save(Long projetId, DocumentDTO dto) {
        Projet projet = projetRepo.findById(projetId)
                .orElseThrow(() -> new RuntimeException("Projet non trouvé"));

        Document doc = new Document();
        doc.setTitre(dto.getTitre());
        doc.setCheminFichier(dto.getCheminFichier());
        doc.setProjet(projet);
        doc.setDateCreation(LocalDateTime.now());

        Document saved = documentRepo.save(doc);
        return mapToDTO(saved);
    }

    public List<DocumentDTO> getDocumentsByProjet(Long projetId) {
        return documentRepo.findByProjetId(projetId).stream()
                .map(this::mapToDTO).collect(Collectors.toList());
    }

    private DocumentDTO mapToDTO(Document doc) {
        DocumentDTO dto = new DocumentDTO();
        dto.setId(doc.getId());
        dto.setTitre(doc.setTitre());
        dto.setCheminFichier(doc.getCheminFichier());
        dto.setDateCreation(doc.getDateCreation());
        dto.setProjetId(doc.getProjet().getId());
        return dto;
    }
}