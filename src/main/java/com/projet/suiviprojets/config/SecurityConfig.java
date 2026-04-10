package com.projet.suiviprojets.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import com.projet.suiviprojets.security.JwtAuthenticationFilter;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.http.HttpMethod;

@Configuration
public class SecurityConfig {
    @Autowired
    private JwtAuthenticationFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Accès public (Login, Swagger et Erreurs)
                        .requestMatchers("/api/auth/**", "/swagger-ui/**", "/v3/api-docs/**", "/error").permitAll()

                        // Employés:
                        // - lecture autorisée pour alimenter les sélecteurs projet (chef de projet)
                        // - écriture réservée à l'administrateur
                        .requestMatchers(HttpMethod.GET, "/api/employes/**").hasAnyAuthority(
                                "ROLE_ADMINISTRATEUR",
                                "ROLE_SECRETAIRE",
                                "ROLE_CHEF_DE_PROJET")
                        .requestMatchers("/api/employes/**", "/api/profils/**").hasAnyAuthority("ROLE_ADMINISTRATEUR")

                        // Dashboard global : lisible par tous les profils applicatifs
                        .requestMatchers("/api/dashboard/**").hasAnyAuthority(
                                "ROLE_ADMINISTRATEUR",
                                "ROLE_SECRETAIRE",
                                "ROLE_DIRECTEUR",
                                "ROLE_CHEF_DE_PROJET",
                                "ROLE_COMPTABLE")

                        // Organismes:
                        // - lecture autorisée au chef de projet (création/édition projet)
                        // - écriture réservée à admin + secrétaire
                        .requestMatchers(HttpMethod.GET, "/api/organismes/**").hasAnyAuthority(
                                "ROLE_ADMINISTRATEUR",
                                "ROLE_SECRETAIRE",
                                "ROLE_CHEF_DE_PROJET")
                        .requestMatchers("/api/organismes/**").hasAnyAuthority("ROLE_ADMINISTRATEUR", "ROLE_SECRETAIRE")
                        .requestMatchers("/api/projets/**")
                        .hasAnyAuthority("ROLE_ADMINISTRATEUR", "ROLE_SECRETAIRE", "ROLE_CHEF_DE_PROJET")

                        // Chef de Projet, Secrétaire & Comptable pour les phases
                        .requestMatchers("/api/phases", "/api/phases/**")
                        .hasAnyAuthority("ROLE_PROJET_MANAGER", "ROLE_CHEF_DE_PROJET", "ROLE_SECRETAIRE", "ROLE_COMPTABLE",
                                "ROLE_ADMINISTRATEUR")

                        // Ressources projet: accessibles au secrétaire également
                        .requestMatchers("/api/affectations", "/api/affectations/**", "/api/livrables", "/api/livrables/**")
                        .hasAnyAuthority("ROLE_CHEF_DE_PROJET", "ROLE_PROJET_MANAGER", "ROLE_SECRETAIRE", "ROLE_ADMINISTRATEUR")

                        // Le COMPTABLE gère les factures
                        .requestMatchers("/api/factures/**").hasAnyAuthority("ROLE_COMPTABLE", "ROLE_ADMINISTRATEUR")

                        // Le DIRECTEUR voit le reporting
                        .requestMatchers("/api/reporting/**")
                        .hasAnyAuthority("ROLE_DIRECTEUR", "ROLE_COMPTABLE", "ROLE_ADMINISTRATEUR")

                        // Tout le reste demande d'être connecté
                        .anyRequest().authenticated());

        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
}
