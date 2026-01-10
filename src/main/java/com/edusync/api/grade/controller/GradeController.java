package com.edusync.api.grade.controller;

import com.edusync.api.grade.model.GradeHoraria;
import com.edusync.api.grade.model.dto.GradeHorariaDTO;
import com.edusync.api.grade.repository.GradeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/grade")
public class GradeController {

    @Autowired
    private GradeRepository repository;

    @GetMapping("/{turma}")
    public List<GradeHoraria> listarPorTurma(@PathVariable String turma) {
        return repository.findByTurma(turma);
    }

    @PostMapping
    @Transactional 
    public GradeHoraria salvarAula(@RequestBody GradeHorariaDTO dados) {
        var aulaExistente = repository.findByTurmaAndDiaAndHorario(
                dados.turma(), dados.dia(), dados.horario()
        );

        aulaExistente.ifPresent(gradeHoraria -> repository.delete(gradeHoraria));

        GradeHoraria novaAula = new GradeHoraria();
        novaAula.setTurma(dados.turma());
        novaAula.setDia(dados.dia());
        novaAula.setHorario(dados.horario());
        novaAula.setMateria(dados.materia());

        return repository.save(novaAula);
    }

    @DeleteMapping("/limpar")
    @Transactional
    public void removerAula(@RequestBody GradeHorariaDTO dados) {
        var aulaExistente = repository.findByTurmaAndDiaAndHorario(
                dados.turma(), dados.dia(), dados.horario()
        );
        aulaExistente.ifPresent(aula -> repository.delete(aula));
    }
}