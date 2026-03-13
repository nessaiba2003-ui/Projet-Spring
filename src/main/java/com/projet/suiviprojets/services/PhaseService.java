package com.projet.suiviprojets.services;


import com.projet.suiviprojets.entities.Phase;
import com.projet.suiviprojets.entities.Projet;
import com.projet.suiviprojets.repositories.PhaseRepository;
import com.projet.suiviprojets.repositories.ProjetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PhaseService {

    @Autowired
    private PhaseRepository phaseRepository;

    @Autowired
    private ProjetRepository projetRepository;

    public Phase save(Phase phase) {
        // 1. Récupérer le projet lié (on suppose que l'ID du projet est dans l'objet phase)
        Projet projet = projetRepository.findById(phase.getProjet().getId())
                .orElseThrow(() -> new RuntimeException("Projet introuvable pour cette phase"));

        //  Les dates de la phase doivent être INCLUSES dans le projet
        if (phase.getDateDebut().isBefore(projet.getDateDebut()) ||
                phase.getDateFin().isAfter(projet.getDateFin())) {
            throw new RuntimeException("Erreur : La durée de la phase dépasse celle du projet !");
        }

        // 3. Initialisation des états par défaut
        phase.setEtatRealisation(false);
        phase.setEtatFacturation(false);
        phase.setEtatPaiement(false);

        return phaseRepository.save(phase);
    }

    public List<Phase> findAll() {
        return phaseRepository.findAll();
    }
}

