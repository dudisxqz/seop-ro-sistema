package com.seopro.api.configuracao.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "configuracoes")
public class ConfiguracaoEscola {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer anoLetivo;

    private String periodo1;
    private String periodo2;
    private String periodo3;
    private String periodo4;

    private Boolean iaHabilitada;
    private Integer iaLimite;
}