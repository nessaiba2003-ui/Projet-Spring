package com.projet.suiviprojets.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
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
    private String telephone;
    private String password;

    @ManyToOne
    @JsonIgnore //c'est pour une structure propre
    private Profil profil; // Relation ajoutée ici

    @OneToMany(mappedBy = "employe")
    @JsonIgnore
    private List<Affectation> affectations;

}
