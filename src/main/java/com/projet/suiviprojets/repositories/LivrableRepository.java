package com.projet.suiviprojets.repositories;

import com.projet.suiviprojets.entities.Livrable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LivrableRepository extends JpaRepository<Livrable, Long> {

    // Chercher les livrables d'une phase précise
    List<Livrable> findByPhase_Id(Long phaseId);
}
