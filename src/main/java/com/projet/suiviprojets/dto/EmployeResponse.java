package com.projet.suiviprojets.dto;

import lombok.Data;
import org.springframework.context.annotation.Profile;

@Data
public class EmployeResponse {
    private Long id;
    private String matricule;
    private String nom;
    private String prenom;
    private String email;
    private String profilLibelle;


    public void setProfilLibelle(Class<? extends Profile> libelle) {
    }

    public void setProfilLibelle(String libelle) {
    }
}

