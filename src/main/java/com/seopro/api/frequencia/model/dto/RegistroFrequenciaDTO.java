package com.seopro.api.frequencia.model.dto;

import java.time.LocalDate;

public record RegistroFrequenciaDTO(
        Long alunoId,
        boolean presente,
        LocalDate data
) {}