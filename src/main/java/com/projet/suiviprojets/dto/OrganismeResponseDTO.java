package com.projet.suiviprojets.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @NoArgsConstructor @AllArgsConstructor
public class OrganismeResponseDTO {
    private Long id;
    private String nom;
    private String code;
    private String contact;
}