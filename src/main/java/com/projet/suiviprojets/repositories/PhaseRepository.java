package com.projet.suiviprojets.repositories;

import com.projet.suiviprojets.entities.Phase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhaseRepository extends JpaRepository<Phase, Long> {

    // Phases qui sont terminées mais pas encore facturées
    List<Phase> findByEstTermineeTrueAndEstFactureeFalse();

    //Facturées mais en attente de paiement
    List<Phase> findByEstFactureeTrueAndEstPayeeFalse();

    //Complètement payées
    List<Phase> findByEstPayeeTrue();

    // Phases liées à un projet précis
    List<Phase> findByProjet_Id(Long projetId);



}

