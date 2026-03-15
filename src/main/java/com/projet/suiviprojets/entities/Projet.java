package com.projet.suiviprojets.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.projet.suiviprojets.entities.Organisme;
import com.projet.suiviprojets.entities.Phase;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Data @NoArgsConstructor @AllArgsConstructor
public class Projet {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nom;
    private String description;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private Double montantGlobal;

    @ManyToOne
    @JoinColumn(name = "organisme_id")
    private Organisme organisme;

    @OneToMany(mappedBy = "projet", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Phase> phases;

    //ajoutée
    @Column(unique = true)
    private String code;

    @ManyToOne
    @JoinColumn(name = "chef_projet_id")
    private Employe chefProjet;

}

