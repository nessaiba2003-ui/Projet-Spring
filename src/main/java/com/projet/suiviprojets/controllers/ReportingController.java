package com.projet.suiviprojets.controllers;

import com.projet.suiviprojets.entities.Phase;
import com.projet.suiviprojets.services.ReportingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Map;

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
}
