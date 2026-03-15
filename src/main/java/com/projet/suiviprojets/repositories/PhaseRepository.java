package com.projet.suiviprojets.repositories;

import com.projet.suiviprojets.entities.Phase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PhaseRepository extends JpaRepository<Phase, Long> {

    List<Phase> findByProjetId(Long projetId);

    //Pour la règle : Somme des montants < Montant du projet
    @Query("SELECT SUM(p.montant) FROM Phase p WHERE p.projet.id = :projetId")
    Double sumMontantsByProjetId(@Param("projetId") Long projetId);

    /*// Phases terminées mais sans facture associée
    @Query("SELECT p FROM Phase p WHERE p.etat = 'TERMINEE' AND p.facture IS NULL")
    List<Phase> findTermineesNonFacturees();

    // Phases facturées mais dont la facture n'est pas payée
    @Query("SELECT p FROM Phase p WHERE p.facture IS NOT NULL AND p.facture.payee = false")
    List<Phase> findFactureesNonPayees();

    // Phases payées
    @Query("SELECT p FROM Phase p WHERE p.facture IS NOT NULL AND p.facture.payee = true")
    List<Phase> findPayees();*/



    //Phases payées
    @Query("SELECT p FROM Phase p WHERE p.etatPaiement = true")
    List<Phase> findPayees();

    // Phases terminées mais non encore facturées
    @Query("SELECT p FROM Phase p WHERE p.etatRealisation = true AND p.etatFacturation = false")
    List<Phase> findTermineesNonFacturees();

    // Phases facturées mais non payées
    @Query("SELECT p FROM Phase p WHERE p.etatFacturation = true AND p.etatPaiement = false")
    List<Phase> findFactureesNonPayees();

}