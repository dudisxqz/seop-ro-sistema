# 🏫 SEOP-RO — Sistema Escolar de Ocorrências e Pedagogia

> Sistema Full Stack para gestão de ocorrências escolares, visando facilitar a comunicação entre professores e coordenação pedagógica.

![Status](https://img.shields.io/badge/Status-Concluído-success)
![Java](https://img.shields.io/badge/Java-24-orange)
![Spring Boot](https://img.shields.io/badge/Spring-Boot-green)
![React](https://img.shields.io/badge/React-Vite-blue)

## 🎯 O Problema
Escolas públicas muitas vezes dependem de registros em papel para ocorrências disciplinares (atrasos, comportamento, tarefas). Isso dificulta a geração de histórico e a tomada de decisão pedagógica.

## 💡 A Solução
O **SEOP-RO** digitaliza esse processo. O professor seleciona o aluno, e o sistema já identifica a turma automaticamente. O registro é salvo em banco de dados e exibido em um Dashboard em tempo real para a coordenação.

---

## 🛠️ Tecnologias Utilizadas

### Backend (API)
- **Java 24** (Versão atualizada)
- **Spring Boot 3** (Framework principal)
- **Spring Data JPA** (Persistência de dados)
- **H2 Database** (Banco em memória para testes rápidos)
- **DTO Pattern** (Data Transfer Object com Java Records)
- **Architecture:** Package by Feature (Organização por domínio: Aluno/Ocorrência)

### Frontend (Interface)
- **React.js** com **Vite** (Build otimizado)
- **Axios** (Integração com API REST)
- **React Router DOM** (Navegação SPA)
- **CSS Modules** (Visual limpo e corporativo)

---

## 🚀 Como rodar o projeto

Este é um mono-repo contendo Backend e Frontend. Você precisará de dois terminais.

### 1️⃣ Passo 1: Backend (API)
1. Abra a pasta raiz do projeto no **IntelliJ IDEA**.
2. Aguarde o Maven baixar todas as dependências do Java.
3. Localize a classe `src/main/java/com/seopro/api/SeopApplication.java`.
4. Clique no botão **Run** (▶️).
5. O Backend iniciará na porta `8080`.
   * *O sistema popula o banco automaticamente com 3 alunos fictícios.*

### 2️⃣ Passo 2: Frontend (Web)
Para rodar a interface, é necessário ter o **Node.js** instalado.

1. Abra um terminal e entre na pasta do frontend:
   ```bash
   cd seop-web

2. Instale as dependências do projeto:
   ```bash
   npm install
   
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev

4. O terminal mostrará o link de acesso (geralmente http://localhost:5173 ); Clique nele para abrir o sistema.
