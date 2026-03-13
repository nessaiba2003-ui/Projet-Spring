package com.projet.suiviprojets.entities;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;

@Embeddable
@Data @NoArgsConstructor @AllArgsConstructor
public class AffectationId implements Serializable {
    private Long employeId;
    private Long phaseId;
}
