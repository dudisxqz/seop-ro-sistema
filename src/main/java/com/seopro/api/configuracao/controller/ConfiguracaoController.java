package com.seopro.api.configuracao.controller;

import com.seopro.api.configuracao.model.ConfiguracaoEscola;
import com.seopro.api.configuracao.model.dto.ConfiguracaoDTO;
import com.seopro.api.configuracao.repository.ConfiguracaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/configuracoes")
public class ConfiguracaoController {

    @Autowired
    private ConfiguracaoRepository repository;

    @GetMapping
    public ConfiguracaoEscola obterConfiguracao() {
        // Tenta achar a configuração existente. Se não tiver (banco novo), cria uma padrão na hora.
        return repository.findAll().stream().findFirst().orElseGet(() -> {
            ConfiguracaoEscola padrao = new ConfiguracaoEscola();
            padrao.setAnoLetivo(2025);
            padrao.setPeriodo1("1º Bimestre");
            padrao.setPeriodo2("2º Bimestre");
            padrao.setPeriodo3("3º Bimestre");
            padrao.setPeriodo4("4º Bimestre");
            padrao.setIaHabilitada(true);
            padrao.setIaLimite(1200);
            return repository.save(padrao);
        });
    }

    @PostMapping
    public ConfiguracaoEscola salvarConfiguracao(@RequestBody ConfiguracaoDTO dados) {
        // Busca a configuração existente para atualizar (garante Singleton no banco)
        ConfiguracaoEscola config = repository.findAll().stream().findFirst().orElse(new ConfiguracaoEscola());

        config.setAnoLetivo(dados.anoLetivo());
        config.setPeriodo1(dados.periodo1());
        config.setPeriodo2(dados.periodo2());
        config.setPeriodo3(dados.periodo3());
        config.setPeriodo4(dados.periodo4());
        config.setIaHabilitada(dados.iaHabilitada());
        config.setIaLimite(dados.iaLimite());

        return repository.save(config);
    }
}