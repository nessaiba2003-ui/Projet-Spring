package com.projet.suiviprojets.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Phase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String titre;
    private Double montant;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private String etat; // ex: TERMINEE, EN_COURS

    @ManyToOne
    private Projet projet;

    @OneToMany(mappedBy = "phase")
    private List<Affectation> affectations;
}
