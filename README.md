# 📲 Soliodonto - Sistema de Procedimentos Odontológicos

**Soliodonto** é um aplicativo móvel desenvolvido com **React Native + Expo**, com foco em estudantes e supervisores da área de odontologia da instituição **Fasiclin/Fasipe**. O sistema permite o cadastro, consulta e validação de procedimentos clínicos, com suporte ao modo offline e sincronização automática com o backend.

---

## 🔧 Tecnologias Utilizadas

### 📱 Mobile (React Native + Expo)
- React Native
- Expo SDK
- Axios
- AsyncStorage
- NetInfo
- React Navigation (Drawer + Stack)
- SecureStore (armazenamento seguro)
- React Native Paper (UI)
- TypeScript

### 🌐 Backend (Node.js + MySQL)
- Node.js
- Express.js
- MySQL2
- Bcrypt
- REST API

---

## ✨ Funcionalidades

### 👨‍⚕️ Aluno
- Login com CPF e senha
- Cadastro de procedimentos com validação
- Salvamento local em caso de falta de conexão
- Sincronização automática quando a internet volta
- Visualização dos procedimentos enviados (pendentes, aprovados ou negados)

### 👨‍🏫 Supervisor
- Listagem dos procedimentos cadastrados por alunos
- Aprovação ou recusa com motivo
- Histórico de solicitações

---

## 🌐 Suporte Offline

- O app detecta automaticamente quando está offline
- Os procedimentos são salvos localmente
- Ao reconectar, os dados são enviados para o servidor
- Usuários permanecem logados até que optem por sair manualmente

---

## 📷 Screenshots

<p float="left">
  <img src="https://user-images.githubusercontent.com/seu-usuario/login-screen.png" width="250" />
  <img src="https://user-images.githubusercontent.com/seu-usuario/procedimento-screen.png" width="250" />
</p>

---

## 🚀 Como Executar o Projeto

### 🔌 Backend (Express + MySQL)

```bash
# Instale as dependências
npm install

# Configure a conexão com o MySQL em /database/mysql.js

# Inicie o servidor
node index.js
```

### 📱 Frontend (Expo)

```bash
# Instale as dependências
npm install

# Inicie o projeto com Expo
npx expo start
```

---

## 📂 Estrutura de Pastas

```
/MeuAppProcedimentos
├── assets/               # Imagens e ícones
├── screens/              # Telas (Login, Cadastro, Aluno, Supervisor)
├── services/             # API e storage local
├── navigation/           # Navegação com Drawer e Stack
├── database/             # Conexão MySQL (backend)
├── models/               # Models de dados (backend)
├── controllers/          # Lógica de API (backend)
├── app.json              # Configuração do app Expo
└── App.tsx               # Entrada principal do app
```

---

## 🔒 Login

- **Usuário:** CPF cadastrado na base
- **Senha:** criptografada (bcrypt)
- **Tipos de usuário:**
  - `2`: Aluno
  - `3`: Supervisor

---

## 📌 Observações

- O sistema só permite login de usuários com vínculo à Odontologia (`ID_CONSEPROFI = 61`)
- Procedimentos e dados são validados no backend antes de serem salvos
- Backend permite o uso de IP local para desenvolvimento com `usesCleartextTraffic`

---

## 🧠 Autor

Desenvolvido por **Gabriel Henrique Queiroz Amaral Miranda**  
Projeto acadêmico - FASIPE Cuiabá

---

## 📃 Licença

Este projeto é licenciado para fins acadêmicos e educacionais. Para uso institucional, entre em contato.