package com.projet.suiviprojets.repositories;

import com.projet.suiviprojets.entities.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    // Retrouver tous les documents techniques attachés à un projet spécifique
    List<Document> findByProjetId(Long projetId);

    // Rechercher un document par son nom de fichier (pour le téléchargement)
    List<Document> findByCode(String code);
}