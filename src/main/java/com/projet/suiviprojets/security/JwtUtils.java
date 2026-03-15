package com.projet.suiviprojets.security;

import io.jsonwebtoken.*;
import org.springframework.stereotype.Component;
import java.util.Date;

@Component
public class JwtUtils {
    private String jwtSecret = "MaCleSecreteSuperLongueEtSecuriseePourLeProjetDeSuiviDeProjets2026_FDSFDSFDSFDSFDSFDSFDSFDSFDSFDSFDS";
    private int jwtExpirationMs = 86400000; // 24h

    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }

    public String getUsernameFromToken(String token) {
        return Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token).getBody().getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
//sert à fabriquer le "ticket" (token) de connexion
