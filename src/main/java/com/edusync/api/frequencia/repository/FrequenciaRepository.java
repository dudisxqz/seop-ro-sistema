package com.edusync.api.frequencia.repository;

import com.edusync.api.frequencia.model.Frequencia;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FrequenciaRepository extends JpaRepository<Frequencia, Long> {
    List<Frequencia> findByAlunoIdOrderByDataDesc(Long alunoId);
}