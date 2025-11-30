# 🏫 EduSync (SEOP) — Sistema de Gestão Escolar Inteligente

> Plataforma Full Stack para gestão pedagógica, integrando notas, ocorrências e inteligência artificial para auxiliar na tomada de decisão escolar.

![Java](https://img.shields.io/badge/Backend-Java_17%2F24-orange)
![Spring Boot](https://img.shields.io/badge/Framework-Spring_Boot_3-green)
![React](https://img.shields.io/badge/Frontend-React_Vite-blue)
![Docker](https://img.shields.io/badge/Infra-Docker_Compose-2496ED)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791)
![OpenAI](https://img.shields.io/badge/AI-OpenAI_GPT-412991)

## 🎯 O Diferencial
Diferente de sistemas comuns, o EduSync utiliza **IA Generativa** para analisar o desempenho acadêmico e comportamental do aluno, gerando pareceres pedagógicos automáticos e gráficos comparativos de turma em tempo real.

---

## 🛠️ Stack Tecnológica

### Backend (API)
- **Spring Security + JWT:** Autenticação e Autorização (RBAC - Role Based Access Control).
- **Spring Data JPA:** Persistência de dados.
- **Docker + PostgreSQL:** Banco de dados containerizado para fácil deploy.
- **OpenAI API:** Integração para análise de dados e geração de textos.
- **Architecture:** Package by Feature (Organização por domínio).

### Frontend (Web)
- **React.js + Vite:** Interface rápida e responsiva.
- **Context API:** Gerenciamento de estado global de autenticação.
- **Recharts:** Visualização de dados (Gráficos de desempenho).
- **CSS Modules + Native Print:** Geração de boletins em PDF fiéis ao modelo oficial.

---

## 🚀 Como rodar o projeto

### Pré-requisitos
- Docker Desktop instalado e rodando.
- Node.js instalado.
- Java JDK 17 ou superior.

### 1️⃣ Subindo a Infraestrutura (Banco de Dados)
Na raiz do projeto, execute:
```bash
docker-compose up -d