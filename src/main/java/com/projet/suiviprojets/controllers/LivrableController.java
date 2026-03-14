package com.projet.suiviprojets.controllers;

import com.projet.suiviprojets.dto.LivrableDTO;
import com.projet.suiviprojets.services.LivrableService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@Tag(name = "Phase 9 : Gestion des Livrables", description = "API pour les livrables associés aux phases")
public class LivrableController {

    @Autowired
    private LivrableService livrableService;

    @Operation(summary = "Enregistrer un livrable pour une phase")
    @PostMapping("/phases/{phaseId}/livrables")
    public ResponseEntity<LivrableDTO> create(@PathVariable Long phaseId, @Valid @RequestBody LivrableDTO livrableDTO) {
        LivrableDTO saved = livrableService.save(phaseId, livrableDTO);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @Operation(summary = "Lister les livrables d'une phase")
    @GetMapping("/phases/{phaseId}/livrables")
    public ResponseEntity<List<LivrableDTO>> getByPhase(@PathVariable Long phaseId) {
        return new ResponseEntity<>(livrableService.findByPhase(phaseId), HttpStatus.OK);
    }

    @Operation(summary = "Obtenir un livrable par son ID")
    @GetMapping("/livrables/{id}")
    public ResponseEntity<LivrableDTO> getById(@PathVariable Long id) {
        LivrableDTO dto = livrableService.findById(id);
        return (dto != null) ? ResponseEntity.ok(dto) : ResponseEntity.notFound().build();
    }

    @Operation(summary = "Modifier un livrable")
    @PutMapping("/livrables/{id}")
    public ResponseEntity<LivrableDTO> update(@PathVariable Long id, @Valid  @RequestBody LivrableDTO dto) {
        return ResponseEntity.ok(livrableService.update(id, dto));
    }

    @Operation(summary = "Supprimer un livrable")
    @DeleteMapping("/livrables/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (livrableService.delete(id)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}


