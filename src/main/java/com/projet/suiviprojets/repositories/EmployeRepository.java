package com.projet.suiviprojets.repositories;

import com.projet.suiviprojets.entities.Employe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeRepository extends JpaRepository<Employe, Long> {

    Optional<Employe> findByLogin(String login);
    // Pour les contrôles d'unicité
    boolean existsByMatricule(String matricule);
    boolean existsByLogin(String login);
    boolean existsByEmail(String email);

    // Recherche multi-critères (Nom ou Prénom)
    List<Employe> findByNomContainingIgnoreCaseOrPrenomContainingIgnoreCase(String nom, String prenom);

    // Trouver les employés DISPONIBLES (ceux qui n'ont pas d'affectation sur cette période)
    @Query("SELECT e FROM Employe e WHERE e.id NOT IN (" +
            "SELECT a.employe.id FROM Affectation a WHERE " +
            "(:debut <= a.dateFin AND :fin >= a.dateDebut))")
    List<Employe> findAvailableEmployes(@Param("debut") LocalDate debut, @Param("fin") LocalDate fin);
}


