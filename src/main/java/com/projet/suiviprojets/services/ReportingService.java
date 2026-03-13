package com.projet.suiviprojets.services;


import com.projet.suiviprojets.entities.Phase;
import com.projet.suiviprojets.repositories.PhaseRepository;
import com.projet.suiviprojets.repositories.ProjetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReportingService {
    private final PhaseRepository phaseRepo;
    private final ProjetRepository projetRepo;

    public List<Phase> getTermineesNonFacturees() {
        return phaseRepo.findTermineesNonFacturees();
    }

    public List<Phase> getFactureesNonPayees() {
        return phaseRepo.findFactureesNonPayees();
    }

    public Map<String, Object> getStatsTableauDeBord() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProjets", projetRepo.count());
        stats.put("phasesEnAttentePaiement", phaseRepo.findFactureesNonPayees().size());
        // Vous pouvez ajouter d'autres calculs ici
        return stats;
    }
}