package com.seopro.api.aluno.controller;

import com.seopro.api.aluno.model.Aluno;
import com.seopro.api.aluno.model.dto.AlunoDTO;
import com.seopro.api.aluno.service.AlunoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/alunos")
public class AlunoController {

    @Autowired
    private AlunoService service;

    @GetMapping
    public List<Aluno> listar() {
        return service.listarTodos();
    }

    @PostMapping
    public Aluno criar(@RequestBody AlunoDTO dados) {
        return service.criar(dados);
    }
}