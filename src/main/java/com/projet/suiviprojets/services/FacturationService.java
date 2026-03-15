package com.projet.suiviprojets.services;

import com.projet.suiviprojets.entities.Facture;
import com.projet.suiviprojets.entities.Phase;
import com.projet.suiviprojets.exceptions.ProjectBusinessException;
import com.projet.suiviprojets.repositories.FactureRepository;
import com.projet.suiviprojets.repositories.PhaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class FacturationService {

    @Autowired
    private FactureRepository factureRepository;

    @Autowired
    private PhaseRepository phaseRepository;

    // Lister toutes les factures
    public List<Facture> findAll() {
        return factureRepository.findAll();
    }

    // Trouver une facture par ID
    public Facture findById(Long id) {
        return factureRepository.findById(id).orElse(null);
    }

    // Enregistrer une facture avec les règles du prof
    public Facture save(Long phaseId, Facture facture) {
        // 1. Récupérer la phase
        Phase phase = phaseRepository.findById(phaseId)
                .orElseThrow(() -> new ProjectBusinessException("Phase introuvable"));

        // RÈGLE 1 : La phase doit être terminée (clôturée)
        if (!phase.getEtatRealisation()) {
            throw new ProjectBusinessException("Erreur : Impossible de facturer une phase non terminée !");
        }

        // RÈGLE 2 : Pas de double facturation
        if (phase.getEtatFacturation()) {
            throw new ProjectBusinessException("Erreur : Cette phase est déjà facturée !");
        }

        // 2. Préparation de la facture
        facture.setPhase(phase);
        facture.setDateFacture(LocalDate.now());

        // 3. Mise à jour de l'état de la phase pour la cohérence
        phase.setEtatFacturation(true);
        phaseRepository.save(phase);

        // 4. Sauvegarde
        return factureRepository.save(facture);
    }

    // Supprimer une facture (Modèle exact de StudentService)
    public boolean delete(Long id) {
        Optional<Facture> factureOptional = factureRepository.findById(id);
        if (factureOptional.isPresent()) {
            factureRepository.delete(factureOptional.get());
            return true;
        } else {
            return false;
        }
    }
}

