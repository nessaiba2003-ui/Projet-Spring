package com.projet.suiviprojets.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class AffectationDTO {
    @NotNull(message = "La date de début d'affectation est obligatoire")
    private LocalDate dateDebut;

    @NotNull(message = "La date de fin d'affectation est obligatoire")
    private LocalDate dateFin;

    @NotBlank(message = "Le rôle de l'employé est obligatoire")
    private String role;

    private String employeNom; // Optionnel : pour l'affichage
    private String phaseLibelle; // Optionnel
}



