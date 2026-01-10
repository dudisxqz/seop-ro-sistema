package com.edusync.api.auth.controller;

import com.edusync.api.auth.model.Usuario;
import com.edusync.api.auth.model.dto.DadosAlteracaoSenha;
import com.edusync.api.auth.repository.UsuarioRepository;
import com.edusync.api.aluno.repository.AlunoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AlunoRepository alunoRepository;

    @GetMapping("/{id}/dados-pessoais")
    public ResponseEntity buscarDadosPessoais(@PathVariable Long id) {
        var usuario = repository.findById(id).orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (usuario.getPerfil() == Usuario.Perfil.ALUNO) {

            var aluno = alunoRepository.findAll().stream()
                    .filter(a -> a.getNome().toLowerCase().contains(usuario.getLogin().toLowerCase()))
                    .findFirst();

            if (aluno.isPresent()) {
                return ResponseEntity.ok(aluno.get());
            }
        }

        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/senha")
    public ResponseEntity alterarSenha(@PathVariable Long id, @RequestBody DadosAlteracaoSenha dados) {
        var usuario = repository.findById(id).orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (!passwordEncoder.matches(dados.senhaAntiga(), usuario.getPassword())) {
            return ResponseEntity.badRequest().body("A senha atual está incorreta.");
        }

        String novaSenhaCriptografada = passwordEncoder.encode(dados.novaSenha());
        usuario.setSenha(novaSenhaCriptografada);
        repository.save(usuario);

        return ResponseEntity.ok().build();
    }
}