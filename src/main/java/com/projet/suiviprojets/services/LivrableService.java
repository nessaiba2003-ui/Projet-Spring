package com.projet.suiviprojets.services;

import com.projet.suiviprojets.dto.LivrableDTO;
import com.projet.suiviprojets.entities.Livrable;
import com.projet.suiviprojets.entities.Phase;
import com.projet.suiviprojets.exceptions.ProjectBusinessException;
import com.projet.suiviprojets.repositories.LivrableRepository;
import com.projet.suiviprojets.repositories.PhaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class LivrableService {

    @Autowired
    private LivrableRepository livrableRepository;

    @Autowired
    private PhaseRepository phaseRepository;

    // POST /api/phases/{phaseId}/livrables
    public LivrableDTO save(Long phaseId, LivrableDTO dto) {
        Long resolvedPhaseId = dto.getPhaseId() != null ? dto.getPhaseId() : phaseId;
        Phase phase = phaseRepository.findById(resolvedPhaseId)
                .orElseThrow(() -> new ProjectBusinessException("Phase introuvable"));

        Livrable livrable = new Livrable();
        livrable.setCode(dto.getCode());
        livrable.setLibelle(dto.getLibelle());
        livrable.setType(dto.getType());
        livrable.setDescription(dto.getDescription());
        livrable.setChemin(dto.getChemin());
        livrable.setDateLivraison(dto.getDateLivraison());
        livrable.setPhase(phase);

        Livrable saved = livrableRepository.save(livrable);
        dto.setId(saved.getId());
        return dto;
    }

    // GET /api/phases/{phaseId}/livrables
    public List<LivrableDTO> findByPhase(Long phaseId) {
        return livrableRepository.findByPhaseId(phaseId).stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    // GET /api/livrables/{id}
    public LivrableDTO findById(Long id) {
        return livrableRepository.findById(id).map(this::mapToDTO).orElse(null);
    }

    // PUT /api/livrables/{id}
    public LivrableDTO update(Long id, LivrableDTO dto) {
        Livrable existing = livrableRepository.findById(id)
                .orElseThrow(() -> new ProjectBusinessException("Livrable introuvable"));

        existing.setCode(dto.getCode());
        existing.setLibelle(dto.getLibelle());
        existing.setType(dto.getType());
        existing.setDescription(dto.getDescription());
        existing.setChemin(dto.getChemin());
        existing.setDateLivraison(dto.getDateLivraison());
        if (dto.getPhaseId() != null) {
            Phase phase = phaseRepository.findById(dto.getPhaseId())
                    .orElseThrow(() -> new ProjectBusinessException("Phase introuvable"));
            existing.setPhase(phase);
        }

        Livrable updated = livrableRepository.save(existing);
        return mapToDTO(updated);
    }

    // DELETE /api/livrables/{id}
    public boolean delete(Long id) {
        Optional<Livrable> livrable = livrableRepository.findById(id);
        if (livrable.isPresent()) {
            livrableRepository.delete(livrable.get());
            return true;
        }
        return false;
    }

    // Méthode utilitaire pour transformer l'entité en DTO
    private LivrableDTO mapToDTO(Livrable l) {
        LivrableDTO dto = new LivrableDTO();
        dto.setId(l.getId());
        dto.setCode(l.getCode());
        dto.setLibelle(l.getLibelle());
        dto.setType(l.getType());
        dto.setDescription(l.getDescription());
        dto.setChemin(l.getChemin());
        dto.setDateLivraison(l.getDateLivraison());
        dto.setPhaseId(l.getPhase() != null ? l.getPhase().getId() : null);
        return dto;
    }
}

