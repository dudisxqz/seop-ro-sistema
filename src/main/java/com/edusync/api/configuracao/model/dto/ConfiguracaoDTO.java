package com.edusync.api.configuracao.model.dto;

public record ConfiguracaoDTO(
        Integer anoLetivo,
        String periodo1,
        String periodo2,
        String periodo3,
        String periodo4,
        Boolean iaHabilitada,
        Integer iaLimite
) {}