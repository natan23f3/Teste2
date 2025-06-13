# Guia de Início Rápido - FinFam

Este guia fornece instruções rápidas para começar a usar o FinFam, uma plataforma SaaS abrangente de gestão financeira familiar em português.

## Pré-requisitos

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
   npm run migrate
   ```

5. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

6. Acesse a aplicação em seu navegador:
   - Frontend: http://localhost:5173
   - API: http://localhost:3000

## Primeiros Passos

### 1. Criar uma Conta

1. Acesse a página inicial e clique em "Registrar"
2. Preencha o formulário com seus dados
3. Confirme seu e-mail (se configurado)
4. Faça login com suas credenciais

### 2. Criar uma Família

1. Após o login, clique em "Criar Família"
2. Dê um nome para sua família
3. Você será automaticamente definido como administrador da família

### 3. Adicionar Membros da Família

1. No painel da família, clique em "Gerenciar Membros"
2. Clique em "Convidar Membro"
3. Insira o e-mail do membro e defina seu nível de acesso
4. O membro receberá um convite por e-mail (se configurado)

### 4. Configurar Orçamentos

1. No dashboard, clique na aba "Orçamentos"
2. Clique em "Novo Orçamento"
3. Selecione a categoria, defina o valor e a data
4. Clique em "Criar Orçamento"

### 5. Registrar Despesas

1. No dashboard, clique na aba "Despesas"
2. Clique em "Nova Despesa"
3. Selecione a categoria, defina o valor e a data
4. Clique em "Criar Despesa"

### 6. Visualizar Relatórios

1. No dashboard, clique na aba "Visão Geral"
2. Visualize os gráficos e resumos financeiros
3. Use os filtros para ajustar o período de visualização

## Recursos Adicionais

- [Manual do Usuário Completo](./user-manual.md)
- [Perguntas Frequentes](./faq.md)
- [Solução de Problemas](./troubleshooting.md)

## Suporte

Se você encontrar problemas ou tiver dúvidas, entre em contato com nossa equipe de suporte:

- E-mail: suporte@finfam.com
- Chat: Disponível no canto inferior direito da aplicação