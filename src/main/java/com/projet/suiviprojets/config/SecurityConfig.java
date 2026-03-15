package com.projet.suiviprojets.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
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
        http.csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        //  Accès public (Login, Swagger et Erreurs)
                        .requestMatchers("/api/auth/**", "/swagger-ui/**", "/v3/api-docs/**", "/error").permitAll()

                        // Restrictions par Rôles
                        // Seul l'ADMINISTRATEUR peut gérer les employés et profils
                        .requestMatchers("/api/employes/**", "/api/profils/**").hasAuthority("ROLE_ADMINISTRATEUR")

                        // La SECRÉTAIRE et l'ADMIN gèrent les projets et organismes
                        .requestMatchers("/api/organismes/**", "/api/projets/**").hasAnyAuthority("ROLE_ADMINISTRATEUR", "ROLE_SECRETAIRE")

                        //à la fois le Chef de Projet ET le Comptable pour les phases
                        .requestMatchers("/api/phases/**").hasAnyAuthority("ROLE_CHEF_DE_PROJET", "ROLE_COMPTABLE")

                        // Le CHEF DE PROJET les affectations et livrables
                        .requestMatchers("/api/affectations/**", "/api/livrables/**").hasAuthority("ROLE_CHEF_DE_PROJET")

                        // Le COMPTABLE gère les factures
                        .requestMatchers("/api/factures/**").hasAuthority("ROLE_COMPTABLE")

                        // Le DIRECTEUR voit le reporting
                        .requestMatchers("/api/reporting/**").hasAuthority("ROLE_DIRECTEUR")

                        // Tout le reste demande d'être au moins connecté
                        .anyRequest().authenticated()
                );

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
