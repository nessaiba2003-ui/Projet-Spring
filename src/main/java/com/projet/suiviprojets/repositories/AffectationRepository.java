package com.projet.suiviprojets.repositories;

import com.projet.suiviprojets.entities.Affectation;
import com.projet.suiviprojets.entities.AffectationId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AffectationRepository extends JpaRepository<Affectation, AffectationId> {

    List<Affectation> findByPhaseId(Long phaseId);
    List<Affectation> findByEmployeId(Long employeId);

    // Vérifier si l'employé est déjà occupé sur cette période (chevauchement de dates)
    @Query("SELECT COUNT(a) > 0 FROM Affectation a WHERE a.employe.id = :empId " +
            "AND (:debut <= a.dateFin AND :fin >= a.dateDebut)")
    boolean isEmployeOccupe(@Param("empId") Long empId, @Param("debut") LocalDate debut, @Param("fin") LocalDate fin);
}

