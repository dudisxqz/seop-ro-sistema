package com.edusync.api.ocorrencia.model;

import com.edusync.api.aluno.model.Aluno;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
public class Ocorrencia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Enumerated(EnumType.STRING)
    private TipoOcorrencia tipo;

    private LocalDateTime dataCriacao = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "aluno_id")
    private Aluno aluno;

    public enum TipoOcorrencia {
        COMPORTAMENTO, ATRASO, TAREFA, AGRESSAO, OUTROS
    }
}