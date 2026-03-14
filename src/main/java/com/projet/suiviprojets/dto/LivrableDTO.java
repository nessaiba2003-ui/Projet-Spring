package com.projet.suiviprojets.dto;

import lombok.Data;

@Data
public class LivrableDTO {
    private Long id;
    private String code;
    private String libelle;
    private String description;
    private String cheminFichier; // Pour l'éventuel upload/stockage
}

