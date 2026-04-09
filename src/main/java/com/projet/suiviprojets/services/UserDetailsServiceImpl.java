package com.projet.suiviprojets.services;

import com.projet.suiviprojets.entities.Employe;
import com.projet.suiviprojets.repositories.EmployeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

// C'est la classe qui explique à Spring comment chercher les employés
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private EmployeRepository employeRepository;

    @Override
    public UserDetails loadUserByUsername(String login) throws UsernameNotFoundException {

        // On cherche l'employé par son login dans le Repository
        Employe employe = employeRepository.findByLogin(login)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé : " + login));


        // IMPORTANT : la BDD stocke déjà des rôles comme ROLE_ADMINISTRATEUR.
        // On évite donc de préfixer deux fois (ROLE_ROLE_*), sinon tous les contrôles échouent.
        String rawRole = employe.getProfil() != null && employe.getProfil().getLibelle() != null
                ? employe.getProfil().getLibelle().trim().toUpperCase()
                : "ROLE_INVITE";
        String role = rawRole.startsWith("ROLE_") ? rawRole : "ROLE_" + rawRole;


        // On renvoie l'utilisateur à Spring Security
        return new User(
                employe.getLogin(),
                employe.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority(role))
        );
    }
}

