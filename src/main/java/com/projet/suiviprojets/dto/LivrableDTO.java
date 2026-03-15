package com.projet.suiviprojets.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class LivrableDTO {
    private Long id;

    @NotBlank(message = "Le code livrable est obligatoire")
    private String code;

    @NotBlank(message = "Le libellé est obligatoire")
    private String libelle;

    @NotBlank(message = "Le type de livrable est obligatoire")
    private String type;

    private String description;

    @NotBlank(message = "Le chemin du fichier est obligatoire")
    private String chemin;

    @NotNull(message = "La date de livraison est obligatoire")
    private LocalDate dateLivraison;
}


