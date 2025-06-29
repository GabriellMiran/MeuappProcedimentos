# 🦷 Soliodonto - Sistema Odontológico Acadêmico

Sistema completo de solicitação, aprovação e controle de procedimentos odontológicos, desenvolvido como projeto acadêmico na FASICLIN com tecnologias modernas como Node.js, React Native (Expo) e MySQL.

## 🚀 Tecnologias Utilizadas

- **Backend**: Node.js, Express, MySQL (sem Sequelize), bcrypt
- **Frontend**: React Native com Expo + TypeScript, AsyncStorage, Axios, SecureStore
- **Banco de Dados**: MySQL
- **Ambiente de Deploy**: Ubuntu Server com Systemd + PM2 ou Node direto

## 🧱 Estrutura de Diretórios

```
soliodonto-app/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── database/
│   └── index.js
│
└── frontend/
    ├── screens/
    ├── services/
    ├── assets/
    ├── App.tsx
    ├── DrawerNavigator.tsx
    ├── app.json
    └── package.json
```

## ⚙️ Instalação

### 🔧 Backend

```bash
cd backend
npm install
node index.js
# ou com systemd
sudo systemctl start backend_soliodonto.service
```

> Certifique-se de configurar o banco corretamente no arquivo de conexão `database/mysql.js`.

### 📱 Frontend (Expo)

```bash
cd frontend
npm install
npx expo start
```

> Configure o IP da API no arquivo `services/api.ts` com o IP da sua máquina ou servidor.

## 🔐 Autenticação

- Login com CPF e senha criptografada (bcrypt)
- Autenticação persistente com **SecureStore**
- Login permanece ativo até o usuário clicar em “Sair”
- Tipos de usuário: `aluno`, `supervisor`

## ✨ Funcionalidades

✅ Login persistente com verificação via API  
✅ Cadastro offline de procedimentos com sincronização automática  
✅ Aprovação ou recusa de procedimentos pelo supervisor  
✅ Busca de nome do paciente pelo ID  
✅ Tela com histórico dos procedimentos  
✅ Toasts e alertas com feedback do status das ações  
✅ Interface intuitiva e institucional com tema da Fasiclin  
✅ Ícone e splash customizados com logo Fasiclin/Soliodonto  
✅ Compatível com build para APK (`eas build`)

## 📦 Geração de APK

```bash
eas build --platform android
```

> Se usar HTTP, adicione no `app.json`:
```json
"plugins": [
  [
    "expo-build-properties",
    {
      "android": {
        "usesCleartextTraffic": true
      }
    }
  ]
]
```

## 🧠 Considerações

- `runtimeVersion` deve ser uma string estável, como `"1.1.1"`
- Backend deve escutar em `0.0.0.0` e estar acessível por IP local
- A sincronização funciona apenas se o app detectar conexão ativa
- Arquivos offline são armazenados com AsyncStorage e enviados quando possível

## 👨‍💻 Autor

Gabriel Henrique Queiroz Amaral Miranda  
Projeto acadêmico para o curso de Análise e Desenvolvimento de Sistemas  
Faculdade FASIPE Cuiabá - FASICLIN  
