package com.projet.suiviprojets.services;

import com.projet.suiviprojets.dto.OrganismeRequestDTO;
import com.projet.suiviprojets.dto.OrganismeResponseDTO;
import com.projet.suiviprojets.entities.Organisme;
import com.projet.suiviprojets.repositories.OrganismeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/*@Service
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
    }}*/


@Service
public class OrganismeService {

    @Autowired
    private OrganismeRepository organismeRepository;

    public OrganismeResponseDTO save(OrganismeRequestDTO dto) {
        Organisme org = new Organisme();
        org.setCode(dto.getCode());
        org.setNom(dto.getNom());
        org.setContact(dto.getContact());
        org.setAdresse(dto.getAdresse());

        Organisme saved = organismeRepository.save(org);
        return mapToResponse(saved);
    }

    public List<OrganismeResponseDTO> findAll() {
        return organismeRepository.findAll().stream().map(this::mapToResponse).toList();
    }

    public OrganismeResponseDTO findById(Long id) {
        return organismeRepository.findById(id).map(this::mapToResponse).orElse(null);
    }

    public boolean delete(Long id) {
        Optional<Organisme> org = organismeRepository.findById(id);
        if (org.isPresent()) {
            // Vérification si autorisé (ex: pas de projets liés)
            if (org.get().getProjets() == null || org.get().getProjets().isEmpty()) {
                organismeRepository.delete(org.get());
                return true;
            }
        }
        return false;
    }

    private OrganismeResponseDTO mapToResponse(Organisme org) {
        OrganismeResponseDTO res = new OrganismeResponseDTO();
        res.setId(org.getId());
        res.setCode(org.getCode());
        res.setNom(org.getNom());
        res.setContact(org.getContact());
        res.setAdresse(org.getAdresse());
        return res;
    }
}

