package com.edusync.api.ocorrencia.model.dto;

import com.edusync.api.ocorrencia.model.Ocorrencia.TipoOcorrencia;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record OcorrenciaDTO(
        @NotBlank(message = "A descrição não pode estar em branco")
        String descricao,

        @NotNull(message = "O tipo da ocorrência é obrigatório")
        TipoOcorrencia tipo,

        @NotNull(message = "É obrigatório selecionar um aluno")
        Long alunoId
) {}