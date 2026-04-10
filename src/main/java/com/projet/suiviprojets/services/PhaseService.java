

package com.projet.suiviprojets.services;

import com.projet.suiviprojets.entities.Phase;
import com.projet.suiviprojets.entities.Projet;
import com.projet.suiviprojets.exceptions.ProjectBusinessException;
import com.projet.suiviprojets.repositories.FactureRepository;
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
    @Autowired private FactureRepository factureRepository;

    public Phase save(Long projetId, Phase phase) {
        Projet projet = projetRepository.findById(projetId).orElseThrow();

        // RÈGLE 1 : Dates incluses dans celles du projet
        if (phase.getDateDebut().isBefore(projet.getDateDebut()) ||
                phase.getDateFin().isAfter(projet.getDateFin())) {
            throw new ProjectBusinessException("Les dates de la phase sortent de l'intervalle du projet !");
        }

        // Contrôle budget désactivé à la demande métier (ne pas bloquer la saisie).

        phase.setProjet(projet);
        // Initialisation des états à false par défaut
        if (phase.getEtatRealisation() == null) phase.setEtatRealisation(false);
        if (phase.getEtatFacturation() == null) phase.setEtatFacturation(false);
        if (phase.getEtatPaiement() == null) phase.setEtatPaiement(false);

        return phaseRepository.save(phase);
    }

    public List<Phase> findByProjet(Long projetId) { return phaseRepository.findByProjetId(projetId); }
    public List<Phase> findAll() { return phaseRepository.findAll(); }

    public Phase findById(Long id) { return phaseRepository.findById(id).orElse(null); }

    public boolean delete(Long id) {
        Optional<Phase> phase = phaseRepository.findById(id);
        if (phase.isPresent()) {
            phaseRepository.delete(phase.get());
            return true;
        }
        return false;
    }

    public Phase update(Long id, Phase incoming) {
        Phase existing = phaseRepository.findById(id).orElseThrow();
        Projet projet = existing.getProjet();

        if (incoming.getDateDebut().isBefore(projet.getDateDebut()) ||
                incoming.getDateFin().isAfter(projet.getDateFin())) {
            throw new ProjectBusinessException("Les dates de la phase sortent de l'intervalle du projet !");
        }

        // Contrôle budget désactivé à la demande métier (ne pas bloquer la saisie).

        existing.setLibelle(incoming.getLibelle());
        existing.setMontant(incoming.getMontant());
        existing.setDateDebut(incoming.getDateDebut());
        existing.setDateFin(incoming.getDateFin());
        if (incoming.getEtatRealisation() != null) existing.setEtatRealisation(incoming.getEtatRealisation());
        if (incoming.getEtatFacturation() != null) existing.setEtatFacturation(incoming.getEtatFacturation());
        if (incoming.getEtatPaiement() != null) existing.setEtatPaiement(incoming.getEtatPaiement());
        return phaseRepository.save(existing);
    }

    // Changement d'état (PATCH)
    public Phase updateEtat(Long id, String type, Boolean etat) {
        Phase phase = phaseRepository.findById(id).orElseThrow();
        if (type.equals("realisation")) phase.setEtatRealisation(etat);
        if (type.equals("facturation")) phase.setEtatFacturation(etat);
        if (type.equals("paiement")) {
            phase.setEtatPaiement(etat);
            // UML workflow: quand phase payée, la facture liée est aussi marquée payée
            factureRepository.findByPhaseId(id).ifPresent(f -> {
                f.setPayee(Boolean.TRUE.equals(etat));
                factureRepository.save(f);
            });
        }
        return phaseRepository.save(phase);
    }
}
