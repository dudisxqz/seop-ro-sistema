package com.seopro.api.ocorrencia.model.dto;

import com.seopro.api.ocorrencia.model.Ocorrencia.TipoOcorrencia;

public record OcorrenciaDTO(
        String descricao,
        TipoOcorrencia tipo,
        Long alunoId
) {}