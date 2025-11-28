package com.seopro.api.aluno.service;

import com.seopro.api.aluno.model.Aluno;
import com.seopro.api.aluno.model.dto.AlunoDTO;
import com.seopro.api.aluno.repository.AlunoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AlunoService {

    @Autowired
    private AlunoRepository repository;

    public List<Aluno> listarTodos() {
        return repository.findAll();
    }

    public Aluno criar(AlunoDTO dados) {
        Aluno aluno = new Aluno();
        aluno.setNome(dados.nome());
        aluno.setTurma(dados.turma());
        aluno.setMatricula(dados.matricula());
        return repository.save(aluno);
    }
}