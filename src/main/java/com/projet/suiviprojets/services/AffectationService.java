package com.projet.suiviprojets.services;

import com.projet.suiviprojets.dto.AffectationDTO;
import com.projet.suiviprojets.entities.Affectation;
import com.projet.suiviprojets.entities.AffectationId;
import com.projet.suiviprojets.entities.Phase;
import com.projet.suiviprojets.exceptions.ProjectBusinessException;
import com.projet.suiviprojets.repositories.AffectationRepository;
import com.projet.suiviprojets.repositories.EmployeRepository;
import com.projet.suiviprojets.repositories.PhaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AffectationService {
    @Autowired
    private AffectationRepository affectationRepository;
    @Autowired private EmployeRepository employeRepository;
    @Autowired private PhaseRepository phaseRepository;

    public AffectationDTO save(Long phaseId, Long employeId, AffectationDTO dto) {
        AffectationId id = new AffectationId(employeId, phaseId);

        // RÈGLE 1 : Pas de doublon (déjà géré par la clé primaire, mais on vérifie)
        if (affectationRepository.existsById(id)) {
            throw new ProjectBusinessException("Cet employé est déjà affecté à cette phase !");
        }

        Phase phase = phaseRepository.findById(phaseId).orElseThrow();

        // RÈGLE 2 & 4 : Cohérence des dates (Incluses dans la phase)
        if (dto.getDateDebut().isBefore(phase.getDateDebut()) || dto.getDateFin().isAfter(phase.getDateFin())) {
            throw new ProjectBusinessException("Les dates d'affectation doivent être comprises dans celles de la phase !");
        }

        // RÈGLE 3 : Employé disponible (pas d'autre mission en même temps)
        if (affectationRepository.isEmployeOccupe(employeId, dto.getDateDebut(), dto.getDateFin())) {
            throw new ProjectBusinessException("L'employé est déjà occupé sur une autre phase durant cette période !");
        }

        Affectation aff = new Affectation();
        aff.setId(id);
        aff.setEmploye(employeRepository.findById(employeId).orElseThrow());
        aff.setPhase(phase);
        aff.setDateDebut(dto.getDateDebut());
        aff.setDateFin(dto.getDateFin());
        aff.setRole(dto.getRole());

        affectationRepository.save(aff);
        return dto;
    }

    public List<Affectation> findByPhase(Long phaseId) { return affectationRepository.findByPhaseId(phaseId); }

    public void delete(Long phaseId, Long employeId) {
        affectationRepository.deleteById(new AffectationId(employeId, phaseId));
    }
}

