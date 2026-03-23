# 📱 Controle de Tarefas

Aplicativo mobile desenvolvido em **React Native com Expo**, com persistência de dados utilizando **SQLite**.  
O sistema permite gerenciar trabalhos e atividades, acompanhando o progresso e as horas trabalhadas.

---

## 🚀 Funcionalidades

- 📌 Cadastro de alunos  
- 📂 Cadastro de trabalhos  
- 🔗 Associação entre alunos e trabalhos  
- ✅ Criação e gerenciamento de atividades  
- ⏱️ Registro de horas trabalhadas por atividade  
- 💾 Armazenamento local com SQLite  

---

## 🛠️ Tecnologias Utilizadas

- React Native  
- Expo  
- SQLite (expo-sqlite)  
- JavaScript (ES6+)  
- React Navigation  

---

## 📁 Estrutura do Projeto

```bash
src/
├── banco-de-dados/   # Configuração do banco e repositórios
├── componentes/      # Componentes reutilizáveis
├── navegacao/        # Configuração de rotas
├── telas/            # Telas do aplicativo
```

---

## ⚙️ Como executar o projeto

Clonar o repositório  
```bash
git clone https://github.com/Pedro-Henrique-Assis/controle-tarefas.git
```

Acessar a pasta  
```bash
cd controle-tarefas
```

Instalar dependências  
```bash
npm install
```

Rodar o projeto  
```bash
npx expo start
```

---

## 🗄️ Banco de Dados

O projeto utiliza SQLite para persistência local.

Tabelas principais:

- Aluno  
- Trabalho  
- Aluno_x_Trabalho  
- Atividade  

---

## 📌 Observações

- O banco de dados é persistido localmente no dispositivo  
- Alterações no schema exigem migração manual ou recriação do banco  

---

## 👨‍💻 Autores

- Pedro Henrique Assis  
- Alex Akio Nishimura Junior  

---

## 📄 Licença

Este projeto é de uso acadêmico.
