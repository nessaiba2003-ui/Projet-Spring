package com.projet.suiviprojets.entities;

import com.projet.suiviprojets.entities.Projet;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data // Requires Lombok dependency
public class Organisme {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String code;
    private String nom;
    private String contact;
    private String adresse;

    @OneToMany(mappedBy = "organisme")
    private List<Projet> projets;
}