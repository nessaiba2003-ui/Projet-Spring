package com.projet.suiviprojets.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.projet.suiviprojets.entities.AffectationId;
import com.projet.suiviprojets.entities.Employe;
import com.projet.suiviprojets.entities.Phase;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Data @NoArgsConstructor @AllArgsConstructor
public class Affectation {
    @EmbeddedId
    private AffectationId id;

    private LocalDate dateDebut;
    private LocalDate dateFin;
    private String role;

    @ManyToOne
    @MapsId("employeId")
    @JsonIgnore
    private Employe employe;

    @ManyToOne
    @MapsId("phaseId")
    @JsonIgnore
    private Phase phase;
}