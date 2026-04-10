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

                        // Seul l'ADMINISTRATEUR peut gérer les employés et profils
                        .requestMatchers("/api/employes/**", "/api/profils/**").hasAnyAuthority("ROLE_ADMINISTRATEUR")

                        // Dashboard global : lisible par tous les profils applicatifs
                        .requestMatchers("/api/dashboard/**").hasAnyAuthority(
                                "ROLE_ADMINISTRATEUR",
                                "ROLE_SECRETAIRE",
                                "ROLE_DIRECTEUR",
                                "ROLE_CHEF_DE_PROJET",
                                "ROLE_COMPTABLE")

                        // Projets: visibles aussi par le CHEF DE PROJET (sinon page vide côté frontend)
                        // Organismes restent gérés par ADMIN + SECRETAIRE
                        .requestMatchers("/api/organismes/**").hasAnyAuthority("ROLE_ADMINISTRATEUR", "ROLE_SECRETAIRE")
                        .requestMatchers("/api/projets/**")
                        .hasAnyAuthority("ROLE_ADMINISTRATEUR", "ROLE_SECRETAIRE", "ROLE_CHEF_DE_PROJET")

                        // Chef de Projet & Comptable pour les phases
                        .requestMatchers("/api/phases/**")
                        .hasAnyAuthority("ROLE_PROJET_MANAGER", "ROLE_CHEF_DE_PROJET", "ROLE_COMPTABLE",
                                "ROLE_ADMINISTRATEUR")

                        // Le CHEF DE PROJET pour affectations et livrables
                        .requestMatchers("/api/affectations/**", "/api/livrables/**")
                        .hasAnyAuthority("ROLE_CHEF_DE_PROJET", "ROLE_PROJET_MANAGER", "ROLE_ADMINISTRATEUR")

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
