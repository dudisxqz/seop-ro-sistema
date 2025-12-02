package com.edusync.api.diario.repository;
import com.edusync.api.diario.model.DiarioClasse;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DiarioRepository extends JpaRepository<DiarioClasse, Long> {}