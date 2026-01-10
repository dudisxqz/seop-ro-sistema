package com.edusync.api.infra.config;

import com.edusync.api.aluno.model.Aluno;
import com.edusync.api.aluno.model.Materia;
import com.edusync.api.aluno.repository.AlunoRepository;
import com.edusync.api.auth.model.Usuario;
import com.edusync.api.auth.repository.UsuarioRepository;
import com.edusync.api.ava.model.Tarefa;
import com.edusync.api.ava.repository.TarefaRepository;
import com.edusync.api.aviso.model.Aviso;
import com.edusync.api.aviso.repository.AvisoRepository;
import com.edusync.api.configuracao.model.ConfiguracaoEscola;
import com.edusync.api.configuracao.repository.ConfiguracaoRepository;
import com.edusync.api.grade.model.GradeHoraria;
import com.edusync.api.grade.repository.GradeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Configuration
public class DataInitializer implements CommandLineRunner {

    @Autowired private AlunoRepository alunoRepository;
    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private TarefaRepository tarefaRepository;
    @Autowired private GradeRepository gradeRepository;
    @Autowired private AvisoRepository avisoRepository;
    @Autowired private ConfiguracaoRepository configuracaoRepository;

    @Override
    public void run(String... args) throws Exception {

        System.out.println("🔄 Verificando usuários...");
        criarUsuarioSeNaoExistir("coordenacao", "123456", Usuario.Perfil.ADMIN);
        criarUsuarioSeNaoExistir("secretaria", "123456", Usuario.Perfil.SECRETARIA);
        criarUsuarioSeNaoExistir("prof", "123456", Usuario.Perfil.PROFESSOR);
        criarUsuarioSeNaoExistir("pai", "123456", Usuario.Perfil.RESPONSAVEL);
        criarUsuarioSeNaoExistir("aluno", "123456", Usuario.Perfil.ALUNO);

        if (alunoRepository.count() == 0) {
            List<Aluno> listaAlunos = new ArrayList<>();

            Aluno joao = new Aluno(); joao.setNome("João Silva"); joao.setTurma("3º Ano A"); joao.setMatricula("2025001");
            listaAlunos.add(joao);
            listaAlunos.addAll(gerarTurma("3º Ano A", 2025100, 29));

            Aluno maria = new Aluno(); maria.setNome("Maria Oliveira"); maria.setTurma("2º Ano B"); maria.setMatricula("2025002");
            listaAlunos.add(maria);
            listaAlunos.addAll(gerarTurma("2º Ano B", 2025200, 29));

            alunoRepository.saveAll(listaAlunos);
            System.out.println("✅ ALUNOS CRIADOS");
        }

        if (tarefaRepository.count() == 0) {
            Tarefa t1 = new Tarefa();
            t1.setTitulo("Frações"); t1.setDescricao("Pág 45."); t1.setDataEntrega(LocalDate.now().plusDays(3)); t1.setTurma("3º Ano A"); t1.setMateria("MATEMATICA");
            Tarefa t2 = new Tarefa();
            t2.setTitulo("Redação"); t2.setDescricao("Tema Férias."); t2.setDataEntrega(LocalDate.now().plusDays(5)); t2.setTurma("3º Ano A"); t2.setMateria("PORTUGUES");
            tarefaRepository.saveAll(Arrays.asList(t1, t2));
            System.out.println("📚 TAREFAS CRIADAS");
        }

        if (gradeRepository.count() == 0) {
            List<GradeHoraria> grade = new ArrayList<>();
            grade.add(criarAula("3º Ano A", GradeHoraria.DiaSemana.SEGUNDA, GradeHoraria.HorarioAula.H07_00, Materia.MATEMATICA));
            grade.add(criarAula("3º Ano A", GradeHoraria.DiaSemana.SEGUNDA, GradeHoraria.HorarioAula.H07_50, Materia.MATEMATICA));
            grade.add(criarAula("3º Ano A", GradeHoraria.DiaSemana.SEGUNDA, GradeHoraria.HorarioAula.H08_40, Materia.PORTUGUES));
            gradeRepository.saveAll(grade);
            System.out.println("📅 GRADE CRIADA");
        }

        if (avisoRepository.count() == 0) {
            Aviso a1 = new Aviso();
            a1.setTitulo("Reunião de Pais"); a1.setMensagem("Sexta-feira às 19h."); a1.setDataPostagem(LocalDate.now());
            avisoRepository.save(a1);
            System.out.println("📢 AVISOS CRIADOS");
        }

        if (configuracaoRepository.count() == 0) {
            ConfiguracaoEscola config = new ConfiguracaoEscola();
            config.setAnoLetivo(2025);
            config.setPeriodo1("1º Bimestre");
            config.setPeriodo2("2º Bimestre");
            config.setPeriodo3("3º Bimestre");
            config.setPeriodo4("4º Bimestre");
            config.setIaHabilitada(true);
            config.setIaLimite(1200);

            configuracaoRepository.save(config);
            System.out.println("⚙️ CONFIGURAÇÕES INICIAIS CRIADAS");
        }
    }

    private void criarUsuarioSeNaoExistir(String login, String senha, Usuario.Perfil perfil) {
        if (usuarioRepository.findByLogin(login) == null) {
            String senhaCriptografada = new BCryptPasswordEncoder().encode(senha);
            Usuario usuario = new Usuario(login, senhaCriptografada, perfil);
            usuarioRepository.save(usuario);
            System.out.println("➕ Usuário criado: " + login);
        }
    }

    private List<Aluno> gerarTurma(String nomeTurma, int matriculaInicial, int quantidade) {
        List<Aluno> turma = new ArrayList<>();
        String[] nomes = {"Ana", "Bruno", "Carlos", "Daniela", "Eduardo", "Fernanda"};
        String[] sobrenomes = {"Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira"};
        Random random = new Random();
        for (int i = 0; i < quantidade; i++) {
            Aluno a = new Aluno();
            String nomeCompleto = nomes[random.nextInt(nomes.length)] + " " + sobrenomes[random.nextInt(sobrenomes.length)];
            a.setNome(nomeCompleto);
            a.setTurma(nomeTurma);
            a.setMatricula(String.valueOf(matriculaInicial + i));
            turma.add(a);
        }
        return turma;
    }

    private GradeHoraria criarAula(String turma, GradeHoraria.DiaSemana dia, GradeHoraria.HorarioAula hora, Materia mat) {
        GradeHoraria g = new GradeHoraria();
        g.setTurma(turma); g.setDia(dia); g.setHorario(hora); g.setMateria(mat);
        return g;
    }
}