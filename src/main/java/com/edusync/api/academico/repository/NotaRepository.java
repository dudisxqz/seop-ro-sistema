package com.edusync.api.academico.repository;

import com.edusync.api.academico.model.Nota;
import com.edusync.api.aluno.model.Aluno;
import com.edusync.api.aluno.model.Materia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface NotaRepository extends JpaRepository<Nota, Long> {

    @Query("SELECT AVG(n.valor) FROM Nota n WHERE n.materia = :materia")
    Double obterMediaDaTurma(@Param("materia") Materia materia);

    boolean existsByAlunoAndMateriaAndBimestre(Aluno aluno, Materia materia, Integer bimestre);
}