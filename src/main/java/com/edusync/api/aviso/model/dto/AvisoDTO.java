package com.edusync.api.aviso.model.dto;

public record AvisoDTO(
        String titulo,
        String mensagem,
        String turmaAlvo 
) {}