package com.projet.suiviprojets.services;

/*import com.projet.suiviprojets.entities.Projet;
import com.projet.suiviprojets.repositories.ProjetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjetService {
    @Autowired
    private ProjetRepository projetRepo;

    public List<Projet> trouverTous() { return projetRepo.findAll(); }

    public Projet enregistrer(Projet p) {
        // Logique : vérifier que la date de fin est après la date de début
        if(p.getDateFin().isBefore(p.getDateDebut())) {
            throw new RuntimeException("Date de fin invalide");
        }
        return projetRepo.save(p);
    }

    public boolean supprimer(Long id) {
        return false;
    }

    public List<Projet> listerTout() {
        return List.of();
    }

    public List<Projet> rechercherParTitre(String titre) {
        return List.of();
    }
}
*/

import com.projet.suiviprojets.dto.ProjetDTO;
import com.projet.suiviprojets.entities.Projet;
import com.projet.suiviprojets.exceptions.ProjectBusinessException;
import com.projet.suiviprojets.repositories.EmployeRepository;
import com.projet.suiviprojets.repositories.OrganismeRepository;
import com.projet.suiviprojets.repositories.ProjetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjetService {
    @Autowired
    private ProjetRepository projetRepository;
    @Autowired private OrganismeRepository organismeRepository;
    @Autowired private EmployeRepository employeRepository;

    public Projet save(ProjetDTO dto) {
        // RÈGLE 1 : dateDebut <= dateFin
        if (dto.getDateDebut().isAfter(dto.getDateFin())) {
            throw new ProjectBusinessException("La date de début doit être avant la date de fin !");
        }
        // RÈGLE 4 : code projet unique
        if (projetRepository.existsByCode(dto.getCode())) {
            throw new ProjectBusinessException("Ce code projet existe déjà !");
        }

        Projet p = new Projet();
        return mapAndSave(p, dto);
    }

    public Projet update(Long id, ProjetDTO dto) {
        Projet p = projetRepository.findById(id).orElseThrow();
        return mapAndSave(p, dto);
    }

    private Projet mapAndSave(Projet p, ProjetDTO dto) {
        // RÈGLE 2 & 3 : Organisme et Chef de projet existants
        p.setOrganisme(organismeRepository.findById(dto.getOrganismeId()).orElseThrow());
        p.setChefProjet(employeRepository.findById(dto.getChefProjetId()).orElseThrow());

        p.setCode(dto.getCode());
        p.setNom(dto.getNom());
        p.setDescription(dto.getDescription());
        p.setDateDebut(dto.getDateDebut());
        p.setDateFin(dto.getDateFin());
        p.setMontantGlobal(dto.getMontantGlobal());
        return projetRepository.save(p);
    }

    public List<Projet> findAll() { return projetRepository.findAll(); }
    public Projet findById(Long id) { return projetRepository.findById(id).orElse(null); }

    // DELETE sous conditions (pas de phases rattachées)
    public boolean delete(Long id) {
        Projet p = projetRepository.findById(id).orElseThrow();
        if (p.getPhases() != null && !p.getPhases().isEmpty()) {
            throw new ProjectBusinessException("Impossible de supprimer : ce projet a déjà des phases !");
        }
        projetRepository.delete(p);
        return true;
    }
}
