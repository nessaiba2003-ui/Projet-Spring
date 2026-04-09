package com.projet.suiviprojets.controllers;

/*import com.projet.suiviprojets.entities.Phase;
import com.projet.suiviprojets.services.ReportingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/reporting")
@RequiredArgsConstructor
public class ReportingController {
    private final ReportingService reportingService;

    @GetMapping("/phases/terminees-non-facturees")
    public List<Phase> getNonFacturees() {
        return reportingService.getTermineesNonFacturees();
    }

    @GetMapping("/phases/facturees-non-payees")
    public List<Phase> getNonPayees() {
        return reportingService.getFactureesNonPayees();
    }

    @GetMapping("/tableau-de-bord")
    public Map<String, Object> getStats() {
        return reportingService.getStatsTableauDeBord();
    }
} Code commenté pour le test des erreurs*/

import com.projet.suiviprojets.entities.Phase;
import com.projet.suiviprojets.entities.Projet;
import com.projet.suiviprojets.services.ReportingService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reporting")
@Tag(name = "Phase 12 : Reporting et Tableaux de Bord")
public class ReportingController {

    @Autowired
    private ReportingService reportingService;

    @GetMapping("/phases/terminees-non-facturees")
    public ResponseEntity<List<Phase>> getTermineesNonFacturees(
            @RequestParam(required = false) LocalDate dateDebut,
            @RequestParam(required = false) LocalDate dateFin,
            @RequestParam(required = false) Long projetId,
            @RequestParam(required = false) Long chefId
    ) {
        return ResponseEntity.ok(reportingService.getTermineesNonFacturees(dateDebut, dateFin, projetId, chefId));
    }

    @GetMapping("/phases/facturees-non-payees")
    public ResponseEntity<List<Phase>> getFactureesNonPayees(
            @RequestParam(required = false) LocalDate dateDebut,
            @RequestParam(required = false) LocalDate dateFin,
            @RequestParam(required = false) Long projetId,
            @RequestParam(required = false) Long chefId
    ) {
        return ResponseEntity.ok(reportingService.getFactureesNonPayees(dateDebut, dateFin, projetId, chefId));
    }

    @GetMapping("/phases/payees")
    public ResponseEntity<List<Phase>> getPayees(
            @RequestParam(required = false) LocalDate dateDebut,
            @RequestParam(required = false) LocalDate dateFin,
            @RequestParam(required = false) Long projetId,
            @RequestParam(required = false) Long chefId
    ) {
        return ResponseEntity.ok(reportingService.getPayees(dateDebut, dateFin, projetId, chefId));
    }

    @GetMapping("/tableau-de-bord")
    public ResponseEntity<Map<String, Object>> getStats(
            @RequestParam(required = false) LocalDate dateDebut,
            @RequestParam(required = false) LocalDate dateFin,
            @RequestParam(required = false) Long projetId,
            @RequestParam(required = false) Long chefId
    ) {
        return ResponseEntity.ok(reportingService.getTableauDeBord(dateDebut, dateFin, projetId, chefId));
    }

    @GetMapping("/projets/en-cours")
    public ResponseEntity<List<Projet>> getEnCours(
            @RequestParam(required = false) LocalDate dateDebut,
            @RequestParam(required = false) LocalDate dateFin,
            @RequestParam(required = false) Long projetId,
            @RequestParam(required = false) Long chefId
    ) {
        return ResponseEntity.ok(reportingService.getProjetsEnCours(dateDebut, dateFin, projetId, chefId));
    }

    @GetMapping("/projets/clotures")
    public ResponseEntity<List<Projet>> getClotures(
            @RequestParam(required = false) LocalDate dateDebut,
            @RequestParam(required = false) LocalDate dateFin,
            @RequestParam(required = false) Long projetId,
            @RequestParam(required = false) Long chefId
    ) {
        return ResponseEntity.ok(reportingService.getProjetsClotures(dateDebut, dateFin, projetId, chefId));
    }
}

