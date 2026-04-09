package com.projet.suiviprojets.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
    private String libelle;
    private Double montant;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private Boolean etatRealisation;
    private Boolean etatFacturation;
    private Boolean etatPaiement;

    @ManyToOne
    @JsonIgnoreProperties({"phases"})
    private Projet projet;

    @OneToMany(mappedBy = "phase")
    @JsonIgnore
    private List<Affectation> affectations;

}
