package com.projet.suiviprojets.repositories;


import com.projet.suiviprojets.entities.Profil;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface ProfilRepository extends JpaRepository<Profil, Long> {
    // On cherche un profil par son intitulé
    Profil findByLibelle(String libelle);
}
