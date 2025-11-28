package com.seopro.api.aluno.repository;

import com.seopro.api.aluno.model.Aluno;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlunoRepository extends JpaRepository<Aluno, Long> {
}