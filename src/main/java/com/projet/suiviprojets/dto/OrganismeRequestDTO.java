package com.projet.suiviprojets.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class OrganismeRequestDTO {
    @NotBlank(message = "Le code organisme est obligatoire")
    private String code;

    @NotBlank(message = "Le nom de l'organisme est obligatoire")
    private String nom;

    @NotBlank(message = "Le nom du contact est obligatoire")
    private String contact;

    @Email(message = "L'adresse email du contact est invalide")
    private String email;

    private String adresse;
    private String telephone;
}

