package com.projet.suiviprojets.services;

import com.projet.suiviprojets.dto.EmployeRequest;
import com.projet.suiviprojets.dto.EmployeResponse;
import com.projet.suiviprojets.entities.Employe;
import com.projet.suiviprojets.entities.Profil;
import com.projet.suiviprojets.repositories.EmployeRepository;
import com.projet.suiviprojets.repositories.ProfilRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import java.util.List;

@Service // Indique à Spring que c'est un service
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
}
