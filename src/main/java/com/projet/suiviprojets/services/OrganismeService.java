package com.projet.suiviprojets.services;

import com.projet.suiviprojets.dto.OrganismeRequestDTO;
import com.projet.suiviprojets.dto.OrganismeResponseDTO;
import com.projet.suiviprojets.entities.Organisme;
import com.projet.suiviprojets.repositories.OrganismeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class OrganismeService {
    private final OrganismeRepository repository;

    public OrganismeResponseDTO save(OrganismeRequestDTO dto) {
        Organisme organisme = new Organisme();
        organisme.setNom(dto.getNom());
        organisme.setCode(dto.getCode());
        // On enregistre
        Organisme saved = repository.save(organisme);
        // On retourne le DTO avec l'ID
        return new OrganismeResponseDTO(saved.getId(), saved.getNom(), saved.getCode(), null);
    }

    public List<OrganismeResponseDTO> getAll() {
        return repository.findAll().stream()
                .map(o -> new OrganismeResponseDTO(o.getId(), o.getNom(), o.getCode(), null))
                .collect(Collectors.toList());
    }

    // Ajoutez delete, update et getById ici...
}
