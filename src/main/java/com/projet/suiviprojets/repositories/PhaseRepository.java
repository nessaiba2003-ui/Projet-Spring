package com.projet.suiviprojets.repositories;

import com.projet.suiviprojets.entities.Phase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface PhaseRepository extends JpaRepository<Phase, Long> {

    // Phases terminées mais sans facture associée
    @Query("SELECT p FROM Phase p WHERE p.etat = 'TERMINEE' AND p.facture IS NULL")
    List<Phase> findTermineesNonFacturees();

    // Phases facturées mais dont la facture n'est pas payée
    @Query("SELECT p FROM Phase p WHERE p.facture IS NOT NULL AND p.facture.payee = false")
    List<Phase> findFactureesNonPayees();

    // Phases payées
    @Query("SELECT p FROM Phase p WHERE p.facture IS NOT NULL AND p.facture.payee = true")
    List<Phase> findPayees();
}