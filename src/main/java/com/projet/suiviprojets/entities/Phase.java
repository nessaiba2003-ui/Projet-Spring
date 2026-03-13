package com.projet.suiviprojets.entities;

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
    private Projet projet;

    @OneToMany(mappedBy = "phase")
    private List<Affectation> affectations;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDateDebut() {
        return dateDebut;
    }

    public void setDateDebut(LocalDate dateDebut) {
        this.dateDebut = dateDebut;
    }

    public Double getMontant() {
        return montant;
    }

    public void setMontant(Double montant) {
        this.montant = montant;
    }

    public String getLibelle() {
        return libelle;
    }

    public void setLibelle(String libelle) {
        this.libelle = libelle;
    }

    public LocalDate getDateFin() {
        return dateFin;
    }

    public void setDateFin(LocalDate dateFin) {
        this.dateFin = dateFin;
    }

    public Boolean getEtatRealisation() {
        return etatRealisation;
    }

    public void setEtatRealisation(Boolean etatRealisation) {
        this.etatRealisation = etatRealisation;
    }

    public Boolean getEtatFacturation() {
        return etatFacturation;
    }

    public void setEtatFacturation(Boolean etatFacturation) {
        this.etatFacturation = etatFacturation;
    }

    public Boolean getEtatPaiement() {
        return etatPaiement;
    }

    public void setEtatPaiement(Boolean etatPaiement) {
        this.etatPaiement = etatPaiement;
    }

    public Projet getProjet() {
        return projet;
    }

    public void setProjet(Projet projet) {
        this.projet = projet;
    }

    public List<Affectation> getAffectations() {
        return affectations;
    }

    public void setAffectations(List<Affectation> affectations) {
        this.affectations = affectations;
    }
}
