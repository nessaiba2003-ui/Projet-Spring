package com.projet.suiviprojets.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeRepository extends JpaRepository<Employe, long> {
    // Liée à l'authentification
    Optional<Employe> findByLogin(String login);

    //Recherche par matricule
    Optional<Employe> findByMatricule(String matricule);
}

