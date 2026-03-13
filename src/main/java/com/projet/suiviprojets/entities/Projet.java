package com.projet.suiviprojets.entities;

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

    @ManyToOne
    @JoinColumn(name = "organisme_id")
    private Organisme organisme;

    @OneToMany(mappedBy = "projet", cascade = CascadeType.ALL)
    private List<Phase> phases;


}

