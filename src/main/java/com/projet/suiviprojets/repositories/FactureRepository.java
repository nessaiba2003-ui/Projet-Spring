package com.projet.suiviprojets.repositories;

import org.springframework.stereotype.Repository;

@Repository
public interface FactureRepository extends JpaRepository<Facture, Long> {
    // Lister les factures émises pour une phase précise
    List<Facture> findByPhaseId(Long phaseId);

    // Rechercher les factures par numéro de facture unique
    Facture findByNumeroFacture(String numero);
}
