package com.seopro.api.infra.config;

import com.seopro.api.aluno.model.Aluno;
import com.seopro.api.aluno.repository.AlunoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import java.util.Arrays;

@Configuration
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private AlunoRepository alunoRepository;

    @Override
    public void run(String... args) throws Exception {
        // Só insere se não tiver ninguém (para não duplicar se mudar o banco)
        if (alunoRepository.count() == 0) {
            Aluno a1 = new Aluno();
            a1.setNome("João Silva");
            a1.setTurma("3º Ano A");
            a1.setMatricula("2025001");

            Aluno a2 = new Aluno();
            a2.setNome("Maria Oliveira");
            a2.setTurma("2º Ano B");
            a2.setMatricula("2025002");

            Aluno a3 = new Aluno();
            a3.setNome("Pedro Santos");
            a3.setTurma("1º Ano C");
            a3.setMatricula("2025003");

            alunoRepository.saveAll(Arrays.asList(a1, a2, a3));
            System.out.println("✅ --- BANCO DE DADOS POPULADO COM SUCESSO ---");
        }
    }
}