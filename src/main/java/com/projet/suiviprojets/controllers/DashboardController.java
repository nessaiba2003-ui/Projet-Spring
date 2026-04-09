package com.projet.suiviprojets.controllers;

import com.projet.suiviprojets.entities.Projet;
import com.projet.suiviprojets.repositories.EmployeRepository;
import com.projet.suiviprojets.repositories.PhaseRepository;
import com.projet.suiviprojets.repositories.ProjetRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final ProjetRepository projetRepository;
    private final PhaseRepository phaseRepository;
    private final EmployeRepository employeRepository;

    public DashboardController(
            ProjetRepository projetRepository,
            PhaseRepository phaseRepository,
            EmployeRepository employeRepository
    ) {
        this.projetRepository = projetRepository;
        this.phaseRepository = phaseRepository;
        this.employeRepository = employeRepository;
    }

    @GetMapping("/overview")
    public ResponseEntity<Map<String, Long>> overview() {
        Map<String, Long> result = new HashMap<>();
        result.put("totalProjets", projetRepository.count());
        result.put("totalPhases", phaseRepository.count());
        result.put("totalEmployes", employeRepository.count());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/recent-projects")
    public ResponseEntity<List<Map<String, Object>>> recentProjects() {
        List<Projet> projects = projetRepository.findAll();
        List<Map<String, Object>> payload = projects.stream()
                .sorted((a, b) -> Long.compare(
                        b.getId() == null ? 0L : b.getId(),
                        a.getId() == null ? 0L : a.getId()
                ))
                .limit(5)
                .map(p -> {
                    Map<String, Object> row = new HashMap<>();
                    row.put("nom", p.getNom() != null ? p.getNom() : ("Projet #" + p.getId()));
                    row.put("chefProjet", p.getChefProjet() != null
                            ? ((p.getChefProjet().getNom() != null ? p.getChefProjet().getNom() : "") +
                            " " +
                            (p.getChefProjet().getPrenom() != null ? p.getChefProjet().getPrenom() : "")).trim()
                            : "Non assigné");
                    row.put("progression", 75);
                    row.put("statut", "En cours");
                    return row;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(payload);
    }
}

