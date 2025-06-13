# FinFam

Plataforma SaaS abrangente de gestão financeira familiar em português.

## Descrição

FinFam é uma plataforma SaaS de gestão financeira familiar que suporta múltiplas famílias (arquitetura multi-tenant) com controle de acesso baseado em funções. A plataforma inclui:

- Página de marketing
- Dashboard empresarial para métricas SaaS
- Dashboards familiares para orçamentos e controle de despesas
- Sistema de autenticação personalizado
- Notificações em tempo real com WebSockets
- Exportação de relatórios em PDF e CSV
- Compartilhamento de orçamentos entre membros da família

## Requisitos

- Node.js (versão 16 ou superior)
- PostgreSQL (versão 14 ou superior)
- NPM (versão 8 ou superior)

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/finfam.git
   cd finfam
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`
   - Configure a conexão com o banco de dados PostgreSQL

   Exemplo de arquivo `.env`:
   ```
   DATABASE_URL=postgresql://usuario:senha@localhost:5432/finfam
   SESSION_SECRET=sua_chave_secreta_aqui
   PORT=3000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:5173
   ```

4. Execute as migrações do banco de dados:
   ```bash
   npm run migrate:generate  # Gera as migrações com base no esquema
   npm run migrate:up        # Executa as migrações
   ```

5. (Opcional) Popule o banco de dados com dados de exemplo:
   ```bash
   npm run seed
   ```

## Execução

### Desenvolvimento

Para iniciar o servidor de desenvolvimento do frontend:
```bash
npm run dev
```

Para iniciar o servidor backend:
```bash
npm run server:dev
```

Para iniciar ambos simultaneamente:
```bash
npm run dev:full
```

### Produção

Para construir o frontend e iniciar o servidor em modo de produção:
```bash
npm run start
```

## Testes

### Testes do Frontend

```bash
npm run test:frontend
```

### Testes do Backend

```bash
npm run test:backend
```

### Todos os Testes

```bash
npm run test:all
```

### Cobertura de Testes

```bash
npm run test:coverage
```

## Documentação

A documentação do projeto está disponível no diretório `docs/`:

- [Guia de Início Rápido](./docs/quickstart.md)
- [Manual do Usuário](./docs/user-manual.md)

## Funcionalidades Principais

### Gestão de Orçamentos

- Criação e edição de orçamentos por categoria
- Visualização de orçamentos em gráficos e tabelas
- Compartilhamento de orçamentos entre membros da família

### Controle de Despesas

- Registro e categorização de despesas
- Acompanhamento de gastos em relação aos orçamentos
- Análise de tendências de gastos

### Notificações em Tempo Real

- Alertas sobre limites de orçamento
- Notificações de novas despesas
- Alertas de compartilhamento de orçamentos

### Exportação de Relatórios

- Exportação de relatórios financeiros em PDF
- Exportação de dados em CSV para análise em outras ferramentas

## Tecnologias Utilizadas

- **Frontend**: React, TypeScript, Vite, TailwindCSS, React Query
- **Backend**: Node.js, Express, TypeScript
- **Banco de Dados**: PostgreSQL, Drizzle ORM
- **Testes**: Jest, React Testing Library
- **Monitoramento**: Winston
- **Tempo Real**: Socket.io
- **Exportação**: jsPDF, react-csv

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.