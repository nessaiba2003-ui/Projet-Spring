/*package com.projet.suiviprojets.services;

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
        doc.setCode(dto.getCode());
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
        dto.setCode(doc.getCode());
        dto.setCheminFichier(doc.getCheminFichier());
        dto.setDateCreation(doc.getDateCreation());
        dto.setProjetId(doc.getProjet().getId());
        return dto;
    }
}*/

package com.projet.suiviprojets.services;

import com.projet.suiviprojets.entities.Document;
import com.projet.suiviprojets.entities.Projet;
import com.projet.suiviprojets.repositories.DocumentRepository;
import com.projet.suiviprojets.repositories.ProjetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private ProjetRepository projetRepository;

    // POST /api/projets/{projetId}/documents
    public Document save(Long projetId, Document document) {
        Projet projet = projetRepository.findById(projetId)
                .orElseThrow(() -> new RuntimeException("Projet introuvable"));

        document.setProjet(projet);
        document.setDateCreation(LocalDateTime.now()); // On fixe la date à l'enregistrement
        return documentRepository.save(document);
    }

    // GET /api/projets/{projetId}/documents
    public List<Document> findByProjetId(Long projetId) {
        return documentRepository.findByProjetId(projetId);
    }

    // GET /api/documents/{id}
    public Document findById(Long id) {
        return documentRepository.findById(id).orElse(null);
    }

    // PUT /api/documents/{id}
    public Document update(Long id, Document details) {
        Document doc = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document introuvable"));

        doc.setCode(details.getCode());
        doc.setDescription(details.getDescription());
        doc.setCheminFichier(details.getCheminFichier());
        // On ne change pas la date de création lors d'un update
        return documentRepository.save(doc);
    }

    // DELETE /api/documents/{id}
    public boolean delete(Long id) {
        Optional<Document> doc = documentRepository.findById(id);
        if (doc.isPresent()) {
            documentRepository.delete(doc.get());
            return true;
        }
        return false;
    }
}

