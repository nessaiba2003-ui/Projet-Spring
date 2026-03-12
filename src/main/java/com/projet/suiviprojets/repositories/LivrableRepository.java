package com.projet.suiviprojets.repositories;

import org.springframework.stereotype.Repository;

@Repository
public interface LivrableRepository extends JpaRepository<Livrable, Long> {

    // Chercher les livrables d'une phase précise
    List<Livrable> findByPhase_Id(Long phaseId);
}
