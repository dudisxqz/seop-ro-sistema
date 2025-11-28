package com.seopro.api.ocorrencia.repository;

import com.seopro.api.ocorrencia.model.Ocorrencia;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OcorrenciaRepository extends JpaRepository<Ocorrencia, Long> {
}