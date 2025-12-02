package com.edusync.api.ocorrencia.repository;

import com.edusync.api.ocorrencia.model.Ocorrencia;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OcorrenciaRepository extends JpaRepository<Ocorrencia, Long> {
}