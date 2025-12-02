package com.edusync.api.aviso.repository;
import com.edusync.api.aviso.model.Aviso;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AvisoRepository extends JpaRepository<Aviso, Long> {
    List<Aviso> findByTurmaAlvoOrTurmaAlvoIsNullOrderByDataPostagemDesc(String turma);
}