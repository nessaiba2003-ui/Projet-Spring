package com.projet.suiviprojets.dto;

import lombok.Data;

@Data
public class EmployeResponse {
    private Long id;
    private String matricule;
    private String nom;
    private String prenom;
    private String email;
    private String profilLibelle; // Pour afficher le nom du profil (ex: Administrateur)
}


