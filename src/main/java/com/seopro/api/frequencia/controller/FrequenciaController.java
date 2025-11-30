package com.seopro.api.frequencia.controller;

import com.seopro.api.aluno.repository.AlunoRepository;
import com.seopro.api.frequencia.model.Frequencia;
import com.seopro.api.frequencia.model.dto.RegistroFrequenciaDTO;
import com.seopro.api.frequencia.repository.FrequenciaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/frequencias")
public class FrequenciaController {

    @GetMapping("/aluno/{id}")
    public List<Frequencia> listarPorAluno(@PathVariable Long id) {
        return frequenciaRepository.findByAlunoIdOrderByDataDesc(id);
    }

    @Autowired
    private FrequenciaRepository frequenciaRepository;

    @Autowired
    private AlunoRepository alunoRepository;

    @PostMapping("/lote")
    public List<Frequencia> realizarChamada(@RequestBody List<RegistroFrequenciaDTO> dados) {

        List<Frequencia> listaParaSalvar = new ArrayList<>();

        for (RegistroFrequenciaDTO item : dados) {
            Frequencia freq = new Frequencia();
            freq.setData(item.data());
            freq.setPresente(item.presente());

            var aluno = alunoRepository.findById(item.alunoId())
                    .orElseThrow(() -> new RuntimeException("Aluno não encontrado ID: " + item.alunoId()));

            freq.setAluno(aluno);
            listaParaSalvar.add(freq);
        }

        return frequenciaRepository.saveAll(listaParaSalvar);

    }
}