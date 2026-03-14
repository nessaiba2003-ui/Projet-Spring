package com.projet.suiviprojets.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class LivrableDTO {
    private Long id;
    private String code;
    private String libelle;
    private String description;
    private String chemin; // Pour l'éventuel upload/stockage
    private LocalDate dateLivraison;
    private String type;

}

