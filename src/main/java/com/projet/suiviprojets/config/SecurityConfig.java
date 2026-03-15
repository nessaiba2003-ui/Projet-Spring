/*package com.projet.suiviprojets.config;

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
}*/

package com.projet.suiviprojets.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
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
                // 1. Désactiver le CSRF (nécessaire pour les APIs REST)
                .csrf(AbstractHttpConfigurer::disable)

                // 2. Gérer les autorisations
                /*.authorizeHttpRequests(auth -> auth
                        // On autorise Swagger pour pouvoir tester les APIs
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        // On autorise l'authentification
                        .requestMatchers("/api/auth/**").permitAll()
                        // On protège le reste (demande un login)
                        .anyRequest().authenticated()
                )*/
                // 2. Gérer les autorisations
                .authorizeHttpRequests(auth -> auth
                        // On autorise TOUT le monde temporairement pour Postman
                        .anyRequest().permitAll()
                )


                // 3. Mode Stateless (Pas de session côté serveur car on utilise JWT)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        // Pour crypter les mots de passe des employés
        return new BCryptPasswordEncoder();
    }
}
