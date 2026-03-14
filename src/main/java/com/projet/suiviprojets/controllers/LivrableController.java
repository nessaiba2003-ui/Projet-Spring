package com.projet.suiviprojets.controllers;

import com.projet.suiviprojets.dto.LivrableDTO;
import com.projet.suiviprojets.services.LivrableService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@Tag(name = "Phase 9 : Gestion des Livrables")
public class LivrableController {

    @Autowired private LivrableService livrableService;

    @Operation(summary = "POST /api/phases/{phaseId}/livrables")
    @PostMapping("/phases/{phaseId}/livrables")
    public ResponseEntity<LivrableDTO> create(@PathVariable Long phaseId, @RequestBody LivrableDTO dto) {
        return new ResponseEntity<>(livrableService.save(phaseId, dto), HttpStatus.CREATED);
    }

    @Operation(summary = "GET /api/phases/{phaseId}/livrables")
    @GetMapping("/phases/{phaseId}/livrables")
    public ResponseEntity<List<LivrableDTO>> getByPhase(@PathVariable Long phaseId) {
        return ResponseEntity.ok(livrableService.findByPhase(phaseId));
    }

    @Operation(summary = "DELETE /api/livrables/{id}")
    @DeleteMapping("/livrables/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        livrableService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "GET /api/livrables/{id}")
    @GetMapping("/livrables/{id}")
    public ResponseEntity<LivrableDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(livrableService.findById(id));
    }

    @Operation(summary = "PUT /api/livrables/{id}")
    @PutMapping("/livrables/{id}")
    public ResponseEntity<LivrableDTO> update(@PathVariable Long id, @RequestBody LivrableDTO dto) {
        return ResponseEntity.ok(livrableService.update(id, dto));
    }
}

