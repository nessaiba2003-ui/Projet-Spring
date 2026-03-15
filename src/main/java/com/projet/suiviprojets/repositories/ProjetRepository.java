package com.projet.suiviprojets.repositories;

import com.projet.suiviprojets.entities.Employe;
import com.projet.suiviprojets.entities.Projet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjetRepository extends JpaRepository<Projet, Long> {

    // Recherche par code unique (pour la validation)
    // On utilise "code" car c'est le nom standard dans le diag de classe
    boolean existsByCode(String code);
    Projet findByCode(String code);

    // Recherche par Chef de Projet (Responsable)
    List<Projet> findByChefProjet(Employe chefProjet);

    // 3. Recherche par nom (équivalent du titre)
    List<Projet> findByNomContainingIgnoreCase(String nom);


    // GET /api/reporting/projets/en-cours
    // Règle : La date de fin est aujourd'hui ou dans le futur
    @Query("SELECT p FROM Projet p WHERE p.dateFin >= CURRENT_DATE")
    List<Projet> findProjetsEnCours();

    // GET /api/reporting/projets/clotures
    // Règle : La date de fin est déjà passée
    @Query("SELECT p FROM Projet p WHERE p.dateFin < CURRENT_DATE")
    List<Projet> findProjetsClotures();


}

