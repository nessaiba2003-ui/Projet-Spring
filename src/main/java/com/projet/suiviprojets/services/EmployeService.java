package com.projet.suiviprojets.services;


import com.projet.suiviprojets.dto.EmployeRequest;
import com.projet.suiviprojets.entities.Employe;
import com.projet.suiviprojets.entities.Profil;
import com.projet.suiviprojets.exceptions.ProjectBusinessException;
import com.projet.suiviprojets.repositories.EmployeRepository;
import com.projet.suiviprojets.repositories.ProfilRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class EmployeService {
    @Autowired
    private EmployeRepository employeRepository;
    @Autowired private ProfilRepository profilRepository;
    @Autowired
    private PasswordEncoder passwordEncoder; // Pour hacher les mots de passe


    public Employe save(EmployeRequest dto) {
        // CONTRÔLE D'UNICITÉ
        if (employeRepository.existsByMatricule(dto.getMatricule())) throw new ProjectBusinessException("Matricule déjà utilisé");
        if (employeRepository.existsByLogin(dto.getLogin())) throw new ProjectBusinessException("Login déjà utilisé");
        if (employeRepository.existsByEmail(dto.getEmail())) throw new ProjectBusinessException("Email déjà utilisé");

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
        //e.setPassword(dto.getPassword());
        e.setPassword(passwordEncoder.encode(dto.getPassword())); //On hache le mot de passe ici
        return employeRepository.save(e);
    }

    // Pour le GET /{id}
    public Employe findById(Long id) {
        return employeRepository.findById(id).orElse(null);
    }

    // Pour le DELETE /{id}
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
        // Mise à jour et hachage du nouveau mot de passe si présent
        existing.setPassword(passwordEncoder.encode(dto.getPassword()));

        // Mise à jour du profil si nécessaire
        com.projet.suiviprojets.entities.Profil newProfil = (Profil) profilRepository.findById(dto.getProfilId())
                .orElseThrow(() -> new ProjectBusinessException("Profil introuvable"));
        existing.setProfil(newProfil);

        return employeRepository.save(existing);
    }

}

