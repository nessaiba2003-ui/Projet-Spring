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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reporting")
@Tag(name = "Phase 12 : Reporting et Tableaux de Bord")
public class ReportingController {

    @Autowired
    private ReportingService reportingService;

    @GetMapping("/phases/terminees-non-facturees")
    public ResponseEntity<List<Phase>> getTermineesNonFacturees() {
        return ResponseEntity.ok(reportingService.getTermineesNonFacturees());
    }

    @GetMapping("/phases/facturees-non-payees")
    public ResponseEntity<List<Phase>> getFactureesNonPayees() {
        return ResponseEntity.ok(reportingService.getFactureesNonPayees());
    }

    @GetMapping("/phases/payees")
    public ResponseEntity<List<Phase>> getPayees() {
        return ResponseEntity.ok(reportingService.getPayees());
    }

    @GetMapping("/tableau-de-bord")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(reportingService.getTableauDeBord());
    }

    @GetMapping("/projets/en-cours")
    public ResponseEntity<List<Projet>> getEnCours() {
        return ResponseEntity.ok(reportingService.getProjetsEnCours());
    }

    @GetMapping("/projets/clotures")
    public ResponseEntity<List<Projet>> getClotures() {
        return ResponseEntity.ok(reportingService.getProjetsClotures());
    }
}

