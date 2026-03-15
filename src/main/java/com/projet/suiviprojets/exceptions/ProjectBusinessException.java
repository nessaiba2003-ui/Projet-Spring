package com.projet.suiviprojets.exceptions;

public class ProjectBusinessException extends RuntimeException {
    public ProjectBusinessException(String message) {
        super(message);
    }
}//^pour afficher un msg d'erreur organisé et compréhensible
