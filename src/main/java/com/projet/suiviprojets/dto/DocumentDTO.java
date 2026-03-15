package com.projet.suiviprojets.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class DocumentDTO {
    private Long id;
    private String code;
    private String type; // ex: PDF, DOCX
    private String cheminFichier;
    private LocalDateTime dateCreation;
    private Long projetId;
}