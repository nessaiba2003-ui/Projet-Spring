package com.projet.suiviprojets.services;


/*import com.projet.suiviprojets.entities.Phase;
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
        return stats;
    }
}*/

import com.projet.suiviprojets.entities.Phase;
import com.projet.suiviprojets.entities.Projet;
import com.projet.suiviprojets.repositories.PhaseRepository;
import com.projet.suiviprojets.repositories.ProjetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReportingService {

    @Autowired
    private PhaseRepository phaseRepository;
    @Autowired private ProjetRepository projetRepository;

    public Map<String, Object> getTableauDeBord() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProjets", projetRepository.count());
        stats.put("projetsEnCours", projetRepository.findProjetsEnCours().size());
        stats.put("phasesAFacturer", phaseRepository.findTermineesNonFacturees().size());
        stats.put("montantTotalEncaisse", phaseRepository.findPayees().stream()
                .mapToDouble(p -> p.getMontant()).sum());
        return stats;
    }

    public List<Phase> getTermineesNonFacturees() { return phaseRepository.findTermineesNonFacturees(); }
    public List<Phase> getFactureesNonPayees() { return phaseRepository.findFactureesNonPayees(); }
    public List<Phase> getPayees() { return phaseRepository.findPayees(); }
    public List<Projet> getProjetsEnCours() { return projetRepository.findProjetsEnCours(); }
    public List<Projet> getProjetsClotures() { return projetRepository.findProjetsClotures(); }
}
