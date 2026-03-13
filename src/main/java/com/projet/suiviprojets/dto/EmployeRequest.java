package com.projet.suiviprojets.dto;

import lombok.Data;



@Data // Génère automatiquement les getters et setters
public class EmployeRequest {
    private String matricule;
    private String nom;
    private String prenom;
    private String email;
    private String login;
    private String password;
    private Long profilId;
}

