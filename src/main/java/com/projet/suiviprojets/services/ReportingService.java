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

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ReportingService {

    @Autowired
    private PhaseRepository phaseRepository;
    @Autowired private ProjetRepository projetRepository;

    public Map<String, Object> getTableauDeBord(LocalDate dateDebut, LocalDate dateFin, Long projetId, Long chefId) {
        List<Projet> projetsEnCoursFiltres = getProjetsEnCours(dateDebut, dateFin, projetId, chefId);
        List<Phase> aFacturerFiltres = getTermineesNonFacturees(dateDebut, dateFin, projetId, chefId);
        List<Phase> payeesFiltrees = getPayees(dateDebut, dateFin, projetId, chefId);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProjets", projetRepository.count());
        stats.put("projetsEnCours", projetsEnCoursFiltres.size());
        stats.put("phasesAFacturer", aFacturerFiltres.size());
        stats.put("montantTotalEncaisse", payeesFiltrees.stream()
                .mapToDouble(p -> p.getMontant()).sum());
        return stats;
    }

    public List<Phase> getTermineesNonFacturees(LocalDate dateDebut, LocalDate dateFin, Long projetId, Long chefId) {
        return filterPhases(phaseRepository.findAll().stream()
                .filter(p -> !Boolean.TRUE.equals(p.getEtatFacturation()))
                .collect(Collectors.toList()), dateDebut, dateFin, projetId, chefId);
    }

    public List<Phase> getFactureesNonPayees(LocalDate dateDebut, LocalDate dateFin, Long projetId, Long chefId) {
        return filterPhases(phaseRepository.findAll().stream()
                .filter(p -> Boolean.TRUE.equals(p.getEtatFacturation()) && !Boolean.TRUE.equals(p.getEtatPaiement()))
                .collect(Collectors.toList()), dateDebut, dateFin, projetId, chefId);
    }

    public List<Phase> getPayees(LocalDate dateDebut, LocalDate dateFin, Long projetId, Long chefId) {
        return filterPhases(phaseRepository.findAll().stream()
                .filter(p -> Boolean.TRUE.equals(p.getEtatPaiement()))
                .collect(Collectors.toList()), dateDebut, dateFin, projetId, chefId);
    }

    public List<Projet> getProjetsEnCours(LocalDate dateDebut, LocalDate dateFin, Long projetId, Long chefId) {
        return filterProjets(projetRepository.findProjetsEnCours(), dateDebut, dateFin, projetId, chefId);
    }

    public List<Projet> getProjetsClotures(LocalDate dateDebut, LocalDate dateFin, Long projetId, Long chefId) {
        return filterProjets(projetRepository.findProjetsClotures(), dateDebut, dateFin, projetId, chefId);
    }

    private List<Phase> filterPhases(List<Phase> phases, LocalDate dateDebut, LocalDate dateFin, Long projetId, Long chefId) {
        return phases.stream()
                .filter(p -> projetId == null || (p.getProjet() != null && projetId.equals(p.getProjet().getId())))
                .filter(p -> chefId == null || (p.getProjet() != null && p.getProjet().getChefProjet() != null && chefId.equals(p.getProjet().getChefProjet().getId())))
                .filter(p -> dateDebut == null || (p.getDateDebut() != null && !p.getDateDebut().isBefore(dateDebut)))
                .filter(p -> dateFin == null || (p.getDateFin() != null && !p.getDateFin().isAfter(dateFin)))
                .collect(Collectors.toList());
    }

    private List<Projet> filterProjets(List<Projet> projets, LocalDate dateDebut, LocalDate dateFin, Long projetId, Long chefId) {
        return projets.stream()
                .filter(p -> projetId == null || projetId.equals(p.getId()))
                .filter(p -> chefId == null || (p.getChefProjet() != null && chefId.equals(p.getChefProjet().getId())))
                .filter(p -> dateDebut == null || (p.getDateDebut() != null && !p.getDateDebut().isBefore(dateDebut)))
                .filter(p -> dateFin == null || (p.getDateFin() != null && !p.getDateFin().isAfter(dateFin)))
                .collect(Collectors.toList());
    }
}
