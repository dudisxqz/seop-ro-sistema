package com.seopro.api.configuracao.repository;

import com.seopro.api.configuracao.model.ConfiguracaoEscola;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConfiguracaoRepository extends JpaRepository<ConfiguracaoEscola, Long> {
}