package com.projet.suiviprojets.repositories;

import com.projet.suiviprojets.entities.Projet;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjetRepository extends JpaRepository<Projet, Long> { }
