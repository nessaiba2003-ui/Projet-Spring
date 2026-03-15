package com.projet.suiviprojets.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Facture {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String reference;
    private Double montant;
    private LocalDate dateFacture;
    private boolean payee; // Pour l'état du paiement

    @OneToOne // Une facture par phase
    @JsonIgnore
    private Phase phase;

}