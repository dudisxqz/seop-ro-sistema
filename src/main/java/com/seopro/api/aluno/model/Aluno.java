package com.seopro.api.aluno.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Aluno {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String turma;

    @Column(unique = true)
    private String matricula;
}