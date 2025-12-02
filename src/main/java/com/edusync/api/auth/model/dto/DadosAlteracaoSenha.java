package com.edusync.api.auth.model.dto;

public record DadosAlteracaoSenha(
        String senhaAntiga,
        String novaSenha
) {}