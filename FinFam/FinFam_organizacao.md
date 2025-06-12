# FinFam - Organização do Projeto

**Nome do Projeto:** FinFam

**Descrição:** Plataforma SaaS abrangente de gestão financeira familiar em português que suporta múltiplas famílias (arquitetura multi-tenant) com controle de acesso baseado em funções, incluindo administradores do sistema, administradores familiares e membros da família. A plataforma apresenta uma página de marketing, dashboard empresarial para métricas SaaS e gestão de clientes, dashboards familiares para orçamentos e controlo de despesas, e sistema de autenticação personalizado.

**Funcionalidades Principais:**

-   Gestão financeira familiar multi-tenant com permissões baseadas em funções
-   Dashboard empresarial mostrando métricas SaaS, receitas e gestão de clientes
-   Dashboards familiares com orçamentos, metas de poupança e controlo de despesas
-   Sistema de autenticação personalizado com funcionalidades de login/registo

**Referência Visual:**

Inspirado nas funcionalidades de partilha familiar do Mint e plataformas SaaS modernas como o dashboard do Stripe, conhecidas pela navegação multi-nível limpa e apresentação abrangente de dados financeiros.

**Guia de Estilo:**

-   Cores:
    -   Primária: #059669 (verde esmeralda)
    -   Secundária: #0F172A (ardósia escura)
    -   Destaque: #3B82F6 (azul)
    -   Fundo: #F8FAFC (ardósia clara)
    -   Sucesso: #10B981 (verde)
    -   Aviso: #F59E0B (âmbar)
-   Design: Fontes Inter/Roboto com suporte para português, layouts modernos baseados em cartões, sistema de grelha responsivo, formulários limpos com estados de validação adequados, estética SaaS profissional com hierarquia clara de informação

**Stack Tecnológica:**

-   Frontend: React 18 com TypeScript, Vite, roteamento Wouter, TanStack Query, Tailwind CSS, componentes Shadcn/ui, Recharts, React Hook Form com Zod
-   Backend: Node.js com Express, TypeScript, Drizzle ORM, PostgreSQL, autenticação Passport.js, Bcrypt
-   Desenvolvimento: TSX, Drizzle Kit, ESLint

## Organização do Projeto

### Estrutura de Pastas e Arquivos

```
FinFam/
├── src/
│   ├── components/
│   │   ├── Dashboard/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Dashboard.css
│   │   ├── BudgetForm/
│   │   │   ├── BudgetForm.tsx
│   │   │   ├── BudgetForm.css
│   │   ├── ExpenseTable/
│   │   │   ├── ExpenseTable.tsx
│   │   │   ├── ExpenseTable.css
│   │   ├── Auth/
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   ├── UI/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   ├── pages/
│   │   ├── MarketingPage.tsx
│   │   ├── EnterpriseDashboard.tsx
│   │   ├── FamilyDashboard.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   ├── utils/
│   │   ├── api.ts
│   │   ├── auth.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── server/
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── budgetRoutes.ts
│   │   ├── expenseRoutes.ts
│   ├── models/
│   │   ├── User.ts
│   │   ├── Family.ts
│   │   ├── Budget.ts
│   │   ├── Expense.ts
│   ├── config/
│   │   ├── passportConfig.ts
│   ├── server.ts
├── drizzle/
│   ├── schema.ts
│   ├── migrations/
├── .env
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

### Componentes Principais do Frontend

-   `Dashboard`: Componente principal do dashboard familiar, exibindo informações de orçamento, metas de poupança e despesas.
-   `BudgetForm`: Formulário para criar e editar orçamentos.
-   `ExpenseTable`: Tabela para exibir e gerenciar despesas.
-   `Login`: Componente para a página de login.
-   `Register`: Componente para a página de registro.
-   `MarketingPage`: Página de marketing principal para o projeto.
-   `EnterpriseDashboard`: Dashboard empresarial para administradores do sistema, exibindo métricas SaaS.
-   `FamilyDashboard`: Dashboard para membros da família, exibindo informações financeiras relevantes.

### Rotas Principais do Backend

-   `API para autenticação`: Rotas para login, registro e gerenciamento de usuários (`/api/auth`).
-   `API para gestão de orçamentos`: Rotas para criar, ler, atualizar e excluir orçamentos (`/api/budgets`).
-   `API para gestão de despesas`: Rotas para criar, ler, atualizar e excluir despesas (`/api/expenses`).

### Modelo de Dados do Banco de Dados

-   `tabelas de usuários`: Armazena informações sobre os usuários (id, nome, email, senha, função).
-   `tabelas de famílias`: Armazena informações sobre as famílias (id, nome, administrador).
-   `tabelas de orçamentos`: Armazena informações sobre os orçamentos (id, família, categoria, valor, data).
-   `tabelas de despesas`: Armazena informações sobre as despesas (id, família, categoria, valor, data).