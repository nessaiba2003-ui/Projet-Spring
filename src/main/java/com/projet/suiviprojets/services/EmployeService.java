package com.projet.suiviprojets.services;


import com.projet.suiviprojets.dto.EmployeRequest;
import com.projet.suiviprojets.entities.Employe;
import com.projet.suiviprojets.entities.Profil;
import com.projet.suiviprojets.exceptions.ProjectBusinessException;
import com.projet.suiviprojets.repositories.EmployeRepository;
import com.projet.suiviprojets.repositories.ProfilRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/*@Service // Indique à Spring que c'est un service
public class EmployeService {

    @Autowired
    private EmployeRepository employeRepository;

    @Autowired
    private ProfilRepository profilRepository;

    // Méthode pour enregistrer
    public EmployeResponse save(EmployeRequest request) {
        Profile profil = profilRepository.findById(request.getProfilId()).orElseThrow();

        Employe e = new Employe();
        e.setMatricule(request.getMatricule());
        e.setNom(request.getNom());
        e.setPrenom(request.getPrenom());
        e.setEmail(request.getEmail());
        e.setLogin(request.getLogin());
        e.setPassword(request.getPassword());
        e.setProfil((Profil) profil);

        Employe saved = employeRepository.save(e);

        // Transformation en Response pour le contrôleur
        EmployeResponse res = new EmployeResponse();
        res.setId(saved.getId());
        res.setNom(saved.getNom());
        res.setProfilLibelle(((Profil) profil).getLibelle());
        return res;
    }

    // Méthode pour lister
    public List<EmployeResponse> findAll() {
        return employeRepository.findAll().stream().map(e -> {
            EmployeResponse res = new EmployeResponse();
            res.setId(e.getId());
            res.setNom(e.getNom());
            res.setProfilLibelle(e.getProfil().getLibelle());
            return res;
        }).toList();
    }
}*/
@Service
public class EmployeService {
    @Autowired
    private EmployeRepository employeRepository;
    @Autowired private ProfilRepository profilRepository;

    public Employe save(EmployeRequest dto) {
        // CONTRÔLE D'UNICITÉ
        if (employeRepository.existsByMatricule(dto.getMatricule())) throw new RuntimeException("Matricule déjà utilisé");
        if (employeRepository.existsByLogin(dto.getLogin())) throw new RuntimeException("Login déjà utilisé");
        if (employeRepository.existsByEmail(dto.getEmail())) throw new RuntimeException("Email déjà utilisé");

        Employe e = new Employe();
        e.setProfil( profilRepository.findById(dto.getProfilId()).orElseThrow());
        return mapAndSave(e, dto);
    }

    public List<Employe> findAll() { return employeRepository.findAll(); }

    public List<Employe> findDisponibles(LocalDate debut, LocalDate fin) {
        return employeRepository.findAvailableEmployes(debut, fin);
    }

    private Employe mapAndSave(Employe e, EmployeRequest dto) {
        e.setMatricule(dto.getMatricule());
        e.setNom(dto.getNom());
        e.setPrenom(dto.getPrenom());
        e.setEmail(dto.getEmail());
        e.setLogin(dto.getLogin());
        e.setTelephone(dto.getTelephone());
        e.setPassword(dto.getPassword());
        return employeRepository.save(e);
    }

    // Pour le GET /{id}
    public Employe findById(Long id) {
        return employeRepository.findById(id).orElse(null);
    }

    // Pour le DELETE /{id} (Modèle exact de StudentService)
    public boolean delete(Long id) {
        Optional<Employe> employeOptional = employeRepository.findById(id);
        if (employeOptional.isPresent()) {
            employeRepository.delete(employeOptional.get());
            return true;
        } else {
            return false;
        }
    }

    // Pour le PUT /{id}
    public Employe update(Long id, EmployeRequest dto) {
        Employe existing = employeRepository.findById(id)
                .orElseThrow(() -> new ProjectBusinessException("Employé introuvable"));

        // Mise à jour des champs
        existing.setNom(dto.getNom());
        existing.setPrenom(dto.getPrenom());
        existing.setEmail(dto.getEmail());
        existing.setTelephone(dto.getTelephone());

        // Mise à jour du profil si nécessaire
        com.projet.suiviprojets.entities.Profil newProfil = (Profil) profilRepository.findById(dto.getProfilId())
                .orElseThrow(() -> new ProjectBusinessException("Profil introuvable"));
        existing.setProfil(newProfil);

        return employeRepository.save(existing);
    }

}

