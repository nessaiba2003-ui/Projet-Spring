package com.projet.suiviprojets.dto;
import lombok.Data;

@Data
public class LoginRequest {
    private String login;
    private String password;
}
//pour gérer les données qui entrent et sortent lors de la connexion.
