Entendi! Você quer que eu já substitua SEU_USUARIO pelo seu nome de usuário do GitHub, DevVictorFigueiredo, nos README.mds para o Task Service, API Gateway e Frontend.

Aqui estão os README.mds prontos para você copiar e colar diretamente, já com o seu nome de usuário:

📝 Task Service - Microsserviço de Gestão de Tarefas

✨ Visão Geral

Este é o microsserviço de backend Task Service, um componente fundamental de uma aplicação full-stack de lista de tarefas. Ele é responsável por toda a lógica de negócio e persistência de dados relacionada às tarefas. Ele opera de forma independente e se comunica via gRPC.

🚀 Funcionalidades

O Task Service oferece as seguintes operações CRUD (Create, Read, Update, Delete) para as tarefas:

    Criar Tarefa: Adiciona uma nova tarefa ao banco de dados.

    Listar Tarefas: Retorna todas as tarefas armazenadas.

    Atualizar Tarefa: Permite modificar o estado de uma tarefa (ex: marcar como concluída).

    Excluir Tarefa: Remove uma tarefa do banco de dados.

🛠️ Tecnologias Utilizadas

    Node.js: Ambiente de execução.

    TypeScript: Linguagem de programação para tipagem estática.

    gRPC: Protocolo de comunicação de alta performance e baixo consumo de banda para comunicação entre microsserviços.

    PostgreSQL: Banco de dados relacional utilizado para armazenar as informações das tarefas.

    pg (node-postgres): Cliente PostgreSQL para Node.js.

⚙️ Configuração e Execução Local

Para colocar o Task Service em funcionamento no seu ambiente local, siga os passos abaixo:

Pré-requisitos

Certifique-se de ter os seguintes softwares instalados em sua máquina:

    Node.js (versão 18 ou superior recomendada)

    npm (gerenciador de pacotes do Node.js)

    PostgreSQL (versão 12 ou superior recomendada)

    Docker Desktop (se você estiver rodando o PostgreSQL via Docker)

1. Banco de Dados PostgreSQL

Este serviço depende de uma instância do PostgreSQL.

    Verifique se o PostgreSQL está rodando:

        No Windows: Verifique nos "Serviços" (services.msc) ou no Docker Desktop se o contêiner do PostgreSQL está ativo.

        No macOS/Linux (com Homebrew/systemctl): brew services list ou sudo systemctl status postgresql.

    Crie o Banco de Dados:
    Acesse seu servidor PostgreSQL (via psql, pgAdmin, ou outra ferramenta) e crie o banco de dados que será usado pelo serviço:
    SQL

    CREATE DATABASE tasks_db;

    (Ou o nome que você definiu para PG_DATABASE no seu .env).

2. Configuração das Variáveis de Ambiente (.env)

Crie um arquivo chamado .env na raiz deste diretório (task-service/) e adicione as seguintes variáveis, preenchendo com suas credenciais do PostgreSQL:
Snippet de código

PG_HOST=localhost
PG_PORT=5432
PG_USER=seu_usuario_postgres
PG_PASSWORD=sua_senha_postgres
PG_DATABASE=tasks_db

Importante: Este arquivo .env já está no .gitignore e NÃO deve ser enviado para o GitHub.

3. Instalação das Dependências

Com o terminal aberto na raiz do diretório task-service/, instale as dependências do projeto:
Bash

npm install

4. Execução do Serviço

Para iniciar o Task Service em modo de desenvolvimento (com recarregamento automático):
Bash

npm run start:dev

O serviço será iniciado na porta 50051 (padrão para gRPC). Você deverá ver mensagens de log indicando que a conexão com o banco de dados foi estabelecida e o servidor gRPC está pronto.

🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests caso encontre problemas ou queira adicionar funcionalidades.

📄 Licença

Este projeto está licenciado sob a MIT License.
