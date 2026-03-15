package com.projet.suiviprojets.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String code;
    private String description;
    private String cheminFichier; // Chemin vers le stockage
    private LocalDateTime dateCreation;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "projet_id")
    private Projet projet;

}
