package com.edusync.api.frequencia.model;

import com.edusync.api.aluno.model.Aluno;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Data
@Entity
@Table(name = "frequencias")
public class Frequencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate data;

    private boolean presente;

    @ManyToOne
    @JoinColumn(name = "aluno_id")
    private Aluno aluno;
}