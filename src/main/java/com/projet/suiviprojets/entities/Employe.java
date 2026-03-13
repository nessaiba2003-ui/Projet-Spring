package com.projet.suiviprojets.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Employe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String matricule;
    private String nom;
    private String prenom;
    private String email;
    private String login;
    private String password;

    @ManyToOne
    private Profil profil; // Relation ajoutée ici

    @OneToMany(mappedBy = "employe")
    private List<Affectation> affectations;
}
