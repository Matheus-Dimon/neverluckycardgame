# 🃏 Card Game Web App

Jogo de cartas multiplayer desenvolvido para navegador, com sistema de autenticação, lista de amigos e interações em tempo real.  
O projeto foi pensado com foco em arquitetura limpa, boas práticas de desenvolvimento e deploy em produção.

🔗 Acesse o projeto: 
https://neverluckycardgame-git-master-matheus-dimons-projects.vercel.app/

---

## 📌 Visão Geral

Este projeto simula um ambiente de jogo de cartas online onde usuários podem:

- Criar conta e realizar login
- Gerenciar lista de amigos
- Interagir em partidas de cartas pelo navegador
- Utilizar uma aplicação moderna, responsiva e escalável

O objetivo principal é demonstrar habilidades em **desenvolvimento full stack**, **autenticação**, **integração frontend/backend** e **deploy em nuvem**.

---

## 🚀 Funcionalidades

- 🔐 Autenticação de usuários (Login e Cadastro)
- 👥 Sistema de amigos (adicionar, listar, remover)
- 🃏 Jogo de cartas no navegador
- 🌐 Comunicação entre frontend e backend via API REST
- 📱 Interface responsiva
- ☁️ Deploy em ambiente de produção

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- HTML5
- CSS3
- JavaScript
- Framework/Biblioteca: *(ex: React, Vue ou Vanilla JS)*
- Hospedagem: **Vercel**

### Backend
- Node.js
- Express
- Autenticação com JWT
- Banco de Dados: *(ex: PostgreSQL / MongoDB)*
- Hospedagem: **Render**

---

## 🧠 Arquitetura

O projeto segue uma separação clara de responsabilidades:

frontend/
├── components
├── pages
├── services
└── styles

backend/
├── controllers
├── routes
├── services
├── middlewares
└── database


- **Frontend** responsável pela interface e experiência do usuário  
- **Backend** responsável por autenticação, regras de negócio e persistência de dados  

---

## 🔐 Autenticação

- Autenticação baseada em **JWT**
- Tokens enviados via headers
- Rotas protegidas no backend
- Validação de sessão no frontend

---

## ⚙️ Como Rodar o Projeto Localmente

### Pré-requisitos
- Node.js (v18+)
- npm ou yarn
- Banco de dados configurado

### Backend
```bash
git clone https://github.com/seu-usuario/seu-backend.git
cd backend
npm install
npm run dev
Frontend
git clone https://github.com/seu-usuario/seu-frontend.git
cd frontend
npm install
npm run dev
🌍 Deploy
Frontend: Vercel

Backend: Render

O deploy foi configurado com variáveis de ambiente para garantir segurança e flexibilidade.

🧪 Testes (opcional se existir)
Testes unitários para regras de negócio

Testes de integração para rotas principais

📈 Próximas Melhorias
Sistema de partidas em tempo real (WebSockets)

Ranking de jogadores

Chat entre amigos

Recuperação de senha

Testes automatizados

👨‍💻 Autor
Desenvolvido por Seu Nome

GitHub: https://github.com/seu-usuario

LinkedIn: https://linkedin.com/in/seu-linkedin

📄 Licença
Este projeto está sob a licença MIT.
Sinta-se livre para estudar, utilizar e contribuir.


---

Se quiser, posso:
- 🔧 Ajustar a README para **React, Next.js ou outro stack específico**
- 🎯 Adaptar o texto para **vaga júnior / pleno / full stack**
- 🧠 Reescrever em **inglês técnico para recrutadores internacionais**
- 🧾 Criar **descrição curta perfeita para o currículo**

Só me dizer 😉
Você disse:
na verdade foi usado react e springboot
O ChatGPT disse:
Perfeito — React + Spring Boot é combo forte pra recrutador 😄
Aqui está a README revisada, já ajustada para esse stack e escrita no padrão que normalmente chama atenção em processos seletivos (clareza + visão de engenharia).

Você pode copiar e colar direto no GitHub.

# 🃏 Card Game Web App

Aplicação web de jogo de cartas multiplayer desenvolvida com **React** no frontend e **Spring Boot** no backend, incluindo **sistema de autenticação**, **cadastro de usuários** e **lista de amigos**.

O projeto foi desenvolvido com foco em **boas práticas**, **separação de responsabilidades**, **arquitetura REST** e **deploy em produção**.

🔗 **Acesse o projeto:**  
- Frontend (Vercel): https://seu-projeto.vercel.app  
- Backend (Render): https://seu-backend.onrender.com  

---

## 📌 Visão Geral

Este projeto permite que usuários criem uma conta, façam login e interajam em um ambiente de jogo de cartas diretamente pelo navegador.  
Além da mecânica do jogo, o sistema oferece funcionalidades sociais, como gerenciamento de amigos.

O objetivo do projeto é demonstrar habilidades em **desenvolvimento Full Stack**, integração entre **React e Spring Boot**, autenticação segura e deploy em nuvem.

---

## 🚀 Funcionalidades

- 🔐 Cadastro e login de usuários
- 🛡️ Autenticação baseada em JWT
- 👥 Sistema de amigos (adicionar e listar)
- 🃏 Jogo de cartas no navegador
- 🌐 API RESTful
- 📱 Interface responsiva
- ☁️ Deploy em ambiente de produção

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- React
- JavaScript (ES6+)
- HTML5
- CSS3
- Axios para consumo da API
- Gerenciamento de estado com Hooks
- Hospedagem: **Vercel**

### Backend
- Java 17+
- Spring Boot
- Spring Web
- Spring Security
- JWT (JSON Web Token)
- JPA / Hibernate
- Banco de Dados: *(ex: PostgreSQL / MySQL)*
- Hospedagem: **Render**

---

- **Controllers** responsáveis pelas rotas da API  
- **Services** concentrando regras de negócio  
- **Repositories** para acesso a dados  
- **Frontend** desacoplado, consumindo a API via HTTP  

---

## 🔐 Segurança e Autenticação

- Autenticação utilizando **Spring Security + JWT**
- Rotas protegidas no backend
- Tokens armazenados no frontend
- Validação de permissões por endpoint

---

## ⚙️ Como Executar o Projeto Localmente

### Pré-requisitos
- Node.js (v18+)
- Java 17+
- Maven
- Banco de dados configurado

---

### Backend (Spring Boot)

```bash
git clone https://github.com/seu-usuario/seu-backend.git
cd backend
./mvnw spring-boot:run
Configure o arquivo application.properties ou application.yml com as variáveis de ambiente.

Frontend (React)
git clone https://github.com/seu-usuario/seu-frontend.git
cd frontend
npm install
npm start
🌍 Deploy
Frontend: Vercel

Backend: Render

As variáveis de ambiente foram configuradas separadamente para cada ambiente (local e produção).

📈 Próximas Melhorias
Partidas em tempo real com WebSocket

Sistema de ranking

Chat entre jogadores

Recuperação de senha

Testes automatizados

👨‍💻 Autor
Desenvolvido por Matheus Dimon

GitHub: github.com/seu-usuario](https://github.com/Matheus-Dimon)

LinkedIn: linkedin.com/in/matheus-dimon-0b577632b
