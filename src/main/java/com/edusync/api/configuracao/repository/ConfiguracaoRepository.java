package com.edusync.api.configuracao.repository;

import com.edusync.api.configuracao.model.ConfiguracaoEscola;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConfiguracaoRepository extends JpaRepository<ConfiguracaoEscola, Long> {
}