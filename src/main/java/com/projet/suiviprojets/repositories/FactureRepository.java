package com.projet.suiviprojets.repositories;

import com.projet.suiviprojets.entities.Facture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FactureRepository extends JpaRepository<Facture, Long> {
    boolean existsByPhaseId(Long phaseId);
    Optional<Facture> findByPhaseId(Long phaseId);

    // Rechercher les factures par numéro de facture unique
    Facture findByReference(String reference);
}
