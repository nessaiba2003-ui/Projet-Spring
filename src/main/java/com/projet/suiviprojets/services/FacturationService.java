package com.projet.suiviprojets.services;


import com.projet.suiviprojets.entities.Facture;
import com.projet.suiviprojets.entities.Phase;
import com.projet.suiviprojets.repositories.FactureRepository;
import com.projet.suiviprojets.repositories.PhaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class FacturationService {
    @Autowired
    private FactureRepository factureRepository;
    @Autowired private PhaseRepository phaseRepository;

    public Facture save(Long phaseId, Facture facture) {
        Phase phase = phaseRepository.findById(phaseId)
                .orElseThrow(() -> new RuntimeException("Phase introuvable"));

        // RÈGLE 1 : Une facture doit concerner une phase terminée
        // (Assurez-vous que votre entité Phase a un champ 'etatRealisation' ou 'cloture')
        if (!phase.getEtatRealisation()) {
            throw new RuntimeException("Erreur : La phase n'est pas encore terminée !");
        }

        // RÈGLE 2 : Une phase déjà facturée ne doit pas l'être deux fois
        if (phase.getEtatFacturation()) {
            throw new RuntimeException("Erreur : Cette phase est déjà facturée !");
        }

        // Préparation de la facture
        facture.setPhase(phase);
        facture.setDateFacture(LocalDate.now());

        // Mise à jour de l'état de la phase pour la cohérence
        phase.setEtatFacturation(true);
        phaseRepository.save(phase);

        return factureRepository.save(facture);
    }

    public List<Facture> findAll() { return factureRepository.findAll(); }
    public Facture findById(Long id) { return factureRepository.findById(id).orElseThrow(); }
    public void delete(Long id) { factureRepository.deleteById(id); }
}
