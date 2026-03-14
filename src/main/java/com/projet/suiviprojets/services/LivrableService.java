package com.projet.suiviprojets.services;

import com.projet.suiviprojets.dto.LivrableDTO;
import com.projet.suiviprojets.entities.Livrable;
import com.projet.suiviprojets.entities.Phase;
import com.projet.suiviprojets.repositories.LivrableRepository;
import com.projet.suiviprojets.repositories.PhaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LivrableService {

    @Autowired private LivrableRepository livrableRepository;
    @Autowired private PhaseRepository phaseRepository;


    // 1. Trouver un livrable par son ID (pour le GET)
    public LivrableDTO findById(Long id) {
        Livrable l = livrableRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Livrable introuvable avec l'ID : " + id));
        return mapToDTO(l);
    }

    // 2. Mettre à jour un livrable (pour le PUT)
    public LivrableDTO update(Long id, LivrableDTO dto) {
        Livrable existing = livrableRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Livrable introuvable"));

        // On met à jour les champs
        existing.setCode(dto.getCode());
        existing.setLibelle(dto.getLibelle());
        existing.setDescription(dto.getDescription());
        existing.setChemin(dto.getCheminFichier());

        Livrable updated = livrableRepository.save(existing);
        return mapToDTO(updated);
    }

    // Petite méthode utilitaire pour éviter de répéter le code de transformation
    private LivrableDTO mapToDTO(Livrable l) {
        LivrableDTO dto = new LivrableDTO();
        dto.setId(l.getId());
        dto.setCode(l.getCode());
        dto.setLibelle(l.getLibelle());
        dto.setDescription(l.getDescription());
        dto.setCheminFichier(l.getChemin());
        return dto;
    }



    // Créer un livrable lié à une phase
    public LivrableDTO save(Long phaseId, LivrableDTO dto) {
        Phase phase = phaseRepository.findById(phaseId)
                .orElseThrow(() -> new RuntimeException("Phase introuvable"));

        Livrable livrable = new Livrable();
        livrable.setCode(dto.getCode());
        livrable.setLibelle(dto.getLibelle());
        livrable.setDescription(dto.getDescription());
        livrable.setChemin(dto.getCheminFichier());
        livrable.setPhase(phase);

        Livrable saved = livrableRepository.save(livrable);
        dto.setId(saved.getId());
        return dto;
    }

    public List<LivrableDTO> findByPhase(Long phaseId) {
        return livrableRepository.findByPhase_Id(phaseId).stream().map(l -> {
            LivrableDTO dto = new LivrableDTO();
            dto.setId(l.getId());
            dto.setCode(l.getCode());
            dto.setLibelle(l.getLibelle());
            dto.setDescription(l.getDescription());
            dto.setCheminFichier(l.getChemin());
            return dto;
        }).collect(Collectors.toList());
    }

    public void delete(Long id) {
        livrableRepository.deleteById(id);
    }

}
