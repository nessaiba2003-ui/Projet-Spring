package com.projet.suiviprojets.repositories;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfilRepository extends JpaRepository<Profile, long> {
    // Permet de trouver un profil par son intitulé
    Profil findByLibelle(String libelle);
}
