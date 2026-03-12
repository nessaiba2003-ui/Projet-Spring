package com.projet.suiviprojets.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface OrganismeRepository extends JpaRepository<Organisme, Long> {


    List<Organisme> findByNomContainingIgnoreCase(String nom);
    Organisme findByCodeClient(String code);
}
