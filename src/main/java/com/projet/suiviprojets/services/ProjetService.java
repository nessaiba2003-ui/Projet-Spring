package com.projet.suiviprojets.services;

import com.projet.suiviprojets.entities.Projet;
import com.projet.suiviprojets.repositories.ProjetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjetService {
    @Autowired
    private ProjetRepository projetRepo;

    public List<Projet> trouverTous() { return projetRepo.findAll(); }

    public Projet enregistrer(Projet p) {
        // Logique : vérifier que la date de fin est après la date de début
        if(p.getDateFin().isBefore(p.getDateDebut())) {
            throw new RuntimeException("Date de fin invalide");
        }
        return projetRepo.save(p);
    }
}
