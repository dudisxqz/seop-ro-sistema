package com.edusync.api.ocorrencia.service;

import com.edusync.api.aluno.model.Aluno;
import com.edusync.api.aluno.repository.AlunoRepository;
import com.edusync.api.ocorrencia.model.Ocorrencia;
import com.edusync.api.ocorrencia.model.dto.OcorrenciaDTO;
import com.edusync.api.ocorrencia.repository.OcorrenciaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OcorrenciaService {

    @Autowired
    private OcorrenciaRepository repository;

    @Autowired
    private AlunoRepository alunoRepository;

    public List<Ocorrencia> listarTodas() {
        return repository.findAll();
    }

    public Ocorrencia criar(OcorrenciaDTO dados) {
        Aluno aluno = alunoRepository.findById(dados.alunoId())
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado!"));

        Ocorrencia ocorrencia = new Ocorrencia();
        ocorrencia.setDescricao(dados.descricao());
        ocorrencia.setTipo(dados.tipo());
        ocorrencia.setAluno(aluno);

        return repository.save(ocorrencia);
    }
}