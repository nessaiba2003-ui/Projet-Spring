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

        // 2. Préparation de la facture (UML: montant hérité de la phase)
        facture.setPhase(phase);
        facture.setMontant(phase.getMontant());
        facture.setDateFacture(LocalDate.now());
        if (facture.getReference() == null || facture.getReference().isBlank()) {
            facture.setReference("FAC-" + phase.getId() + "-" + System.currentTimeMillis());
        }

        // 3. Mise à jour de l'état de la phase pour la cohérence
        phase.setEtatFacturation(true);
        phase.setEtatPaiement(Boolean.TRUE.equals(facture.isPayee()));
        phaseRepository.save(phase);

        // 4. Sauvegarde
        return factureRepository.save(facture);
    }

    public Facture update(Long id, Facture incoming) {
        Facture existing = factureRepository.findById(id)
                .orElseThrow(() -> new ProjectBusinessException("Facture introuvable"));

        if (incoming.getReference() != null) existing.setReference(incoming.getReference());
        // UML: montant facture aligné au montant de la phase liée
        if (existing.getPhase() != null && existing.getPhase().getMontant() != null) {
            existing.setMontant(existing.getPhase().getMontant());
        } else if (incoming.getMontant() != null) {
            existing.setMontant(incoming.getMontant());
        }
        if (incoming.getDateFacture() != null) existing.setDateFacture(incoming.getDateFacture());
        existing.setPayee(incoming.isPayee());

        if (existing.getPhase() != null) {
            Phase phase = existing.getPhase();
            // Rester cohérent avec le workflow UML
            phase.setEtatFacturation(true);
            phase.setEtatPaiement(existing.isPayee());
            phaseRepository.save(phase);
        }

        return factureRepository.save(existing);
    }

    // Supprimer une facture
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

