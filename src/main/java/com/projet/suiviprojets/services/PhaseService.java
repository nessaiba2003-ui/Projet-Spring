/*package com.projet.suiviprojets.services;


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

*/

package com.projet.suiviprojets.services;

import com.projet.suiviprojets.entities.Phase;
import com.projet.suiviprojets.entities.Projet;
import com.projet.suiviprojets.exceptions.ProjectBusinessException;
import com.projet.suiviprojets.repositories.PhaseRepository;
import com.projet.suiviprojets.repositories.ProjetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class PhaseService {

    @Autowired private PhaseRepository phaseRepository;
    @Autowired private ProjetRepository projetRepository;

    public Phase save(Long projetId, Phase phase) {
        Projet projet = projetRepository.findById(projetId).orElseThrow();

        // RÈGLE 1 : Dates incluses dans celles du projet
        if (phase.getDateDebut().isBefore(projet.getDateDebut()) ||
                phase.getDateFin().isAfter(projet.getDateFin())) {
            throw new ProjectBusinessException("Les dates de la phase sortent de l'intervalle du projet !");
        }

        // RÈGLE 2 : Somme des montants ne dépasse pas le montant global
        Double totalActuel = phaseRepository.sumMontantsByProjetId(projetId);
        if (totalActuel == null) totalActuel = 0.0;
        if (totalActuel + phase.getMontant() > projet.getMontantGlobal()) {
            throw new  ProjectBusinessException("Le montant total des phases dépasse le budget du projet !");
        }

        phase.setProjet(projet);
        // Initialisation des états à false par défaut
        if (phase.getEtatRealisation() == null) phase.setEtatRealisation(false);
        if (phase.getEtatFacturation() == null) phase.setEtatFacturation(false);
        if (phase.getEtatPaiement() == null) phase.setEtatPaiement(false);

        return phaseRepository.save(phase);
    }

    public List<Phase> findByProjet(Long projetId) { return phaseRepository.findByProjetId(projetId); }

    public Phase findById(Long id) { return phaseRepository.findById(id).orElse(null); }

    public boolean delete(Long id) {
        Optional<Phase> phase = phaseRepository.findById(id);
        if (phase.isPresent()) {
            phaseRepository.delete(phase.get());
            return true;
        }
        return false;
    }

    // Changement d'état (PATCH)
    public Phase updateEtat(Long id, String type, Boolean etat) {
        Phase phase = phaseRepository.findById(id).orElseThrow();
        if (type.equals("realisation")) phase.setEtatRealisation(etat);
        if (type.equals("facturation")) phase.setEtatFacturation(etat);
        if (type.equals("paiement")) phase.setEtatPaiement(etat);
        return phaseRepository.save(phase);
    }
}
