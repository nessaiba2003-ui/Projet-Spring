package com.projet.suiviprojets.controllers;

import com.projet.suiviprojets.entities.Organisme;
import com.projet.suiviprojets.repositories.OrganismeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/organismes")
public class OrganismeController {

    @Autowired
    private OrganismeRepository repository;

    @GetMapping
    public List<Organisme> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public Organisme save(@RequestBody Organisme organisme) {
        return repository.save(organisme);
    }
}