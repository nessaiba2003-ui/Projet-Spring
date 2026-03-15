package com.projet.suiviprojets.repositories;

import com.projet.suiviprojets.entities.Facture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FactureRepository extends JpaRepository<Facture, Long> {
    // Lister les factures émises pour une phase précise
    boolean findByPhaseId(Long phaseId);

    // Rechercher les factures par numéro de facture unique
    Facture findByReference(String reference);
}
