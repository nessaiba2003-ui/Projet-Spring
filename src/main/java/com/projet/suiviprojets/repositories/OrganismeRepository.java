package com.projet.suiviprojets.repositories;

import com.projet.suiviprojets.entities.Organisme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrganismeRepository extends JpaRepository<Organisme, Long> {
    // Custom searches for the "Recherche" part of your project
    /*List<Organisme> findByNomContaining(String nom);
    List<Organisme> findByCode(String code);*/
    List<Organisme> findByNomContainingIgnoreCaseOrCodeContainingIgnoreCaseOrContactContainingIgnoreCase(
            String nom, String code, String contact);
}
