package com.projet.suiviprojets.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Affectation {
    @EmbeddedId
    private AffectationId id = new AffectationId();

    @ManyToOne
    @MapsId("employeId")
    @JoinColumn(name = "employe_id")
    private Employe employe;

    @ManyToOne @MapsId("phaseId")
    @JoinColumn(name = "phase_id")
    private Phase phase;

    private LocalDate dateAffectation;
    private int chargeHoraire; // Optionnel : pour la gestion de projet
}
