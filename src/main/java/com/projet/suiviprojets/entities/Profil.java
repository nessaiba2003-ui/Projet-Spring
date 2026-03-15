package com.projet.suiviprojets.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.context.annotation.Profile;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Profil {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String libelle;// ex: ADMIN, COMPTABLE, CHEF_PROJET
    private String code;

    @OneToMany(mappedBy = "profil")
    @JsonIgnore //pour annuler l'affichage en boucles des profils
    private List<Employe> employes;


}