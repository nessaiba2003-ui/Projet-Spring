package com.projet.suiviprojets.repositories;

import com.projet.suiviprojets.entities.Employe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployeRepository extends JpaRepository<Employe, Long> {
    // Liée à l'authentification
    Optional<Employe> findByLogin(String login);

    //Recherche par matricule
    Optional<Employe> findByMatricule(String matricule);
}

