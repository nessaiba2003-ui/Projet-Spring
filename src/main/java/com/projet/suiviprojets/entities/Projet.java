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
    private Double montantGlobal;

    @ManyToOne
    @JoinColumn(name = "organisme_id")
    private Organisme organisme;

    @OneToMany(mappedBy = "projet", cascade = CascadeType.ALL)
    private List<Phase> phases;

    //ajoutée
    @Column(unique = true)
    private String code;

    @ManyToOne
    @JoinColumn(name = "chef_projet_id")
    private Employe chefProjet;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getDateDebut() {
        return dateDebut;
    }

    public void setDateDebut(LocalDate dateDebut) {
        this.dateDebut = dateDebut;
    }

    public LocalDate getDateFin() {
        return dateFin;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Employe getChefProjet() {
        return chefProjet;
    }

    public void setChefProjet(Employe chefProjet) {
        this.chefProjet = chefProjet;
    }

    public void setDateFin(LocalDate dateFin) {
        this.dateFin = dateFin;
    }

    public Double getMontantGlobal() {
        return montantGlobal;
    }

    public void setMontantGlobal(Double montantGlobal) {
        this.montantGlobal = montantGlobal;
    }

    public Organisme getOrganisme() {
        return organisme;
    }

    public void setOrganisme(Organisme organisme) {
        this.organisme = organisme;
    }

    public List<Phase> getPhases() {
        return phases;
    }

    public void setPhases(List<Phase> phases) {
        this.phases = phases;
    }
}

