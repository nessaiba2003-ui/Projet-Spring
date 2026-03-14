package com.projet.suiviprojets.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.time.LocalDate;

@Data
public class ProjetDTO {
    @NotBlank(message = "Le code projet est obligatoire")
    private String code;

    @NotBlank(message = "Le nom du projet est obligatoire")
    private String nom;

    private String description;

    @NotNull(message = "La date de début est obligatoire")
    private LocalDate dateDebut;

    @NotNull(message = "La date de fin est obligatoire")
    private LocalDate dateFin;

    @NotNull(message = "Le montant global est obligatoire")
    @Positive(message = "Le montant doit être supérieur à zéro")
    private Double montantGlobal;

    @NotNull(message = "L'organisme client est obligatoire")
    private Long organismeId;

    @NotNull(message = "Le chef de projet est obligatoire")
    private Long chefProjetId;
}

