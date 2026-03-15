package com.projet.suiviprojets.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // 1. Désactiver le CSRF (Obligatoire pour tes tests de formulaire)
                .csrf(csrf -> csrf.disable())

                // 2. Configuration des accès
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/inscription/**", "/api/auth/**", "/css/**", "/js/**").permitAll() // Public
                        .requestMatchers("/api/organismes/**", "/admin/**").hasRole("ADMIN") // Admin seulement
                        .anyRequest().authenticated() // Tout le reste demande une connexion
                )

                // 3. Gestion de la session (Stateless pour les API ou Stateful pour Thymeleaf)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED) // Recommandé pour Thymeleaf/Login
                )

                // 4. Activer le formulaire de connexion par défaut
                .formLogin(form -> form.defaultSuccessUrl("/inscription", true));

        return http.build();
    }


    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}