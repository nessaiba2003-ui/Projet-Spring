package com.projet.suiviprojets.repositories;

import com.projet.suiviprojets.entities.Employe;
import com.projet.suiviprojets.entities.Projet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjetRepository extends JpaRepository<Projet, Long> {
    // Recherche par code unique du projet
    Projet findByRefProjet(String ref);

    // Projets d'un chef de projet spécifique
    List<Projet> findByResponsable(Employe chef);

    // Recherche par titre (Directeur/Secrétaire)
    List<Projet> findByTitreContainingIgnoreCase(String titre);
}
