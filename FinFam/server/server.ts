import express, { Request, Response, NextFunction } from 'express';
import authRoutes from './routes/authRoutes';
import budgetRoutes from './routes/budgetRoutes';
import expenseRoutes from './routes/expenseRoutes';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import passport from 'passport';
import session from 'express-session';
import * as dotenv from 'dotenv';
import './config/passportConfig'; // Importa a configuração do Passport

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

export const app = express();
const port = 3000;

app.use(express.json());

// Configuração da conexão com o banco de dados
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);

// Configuração do Passport
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
import flash from 'connect-flash';

app.use(flash());

app.use('/api/auth', authRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/expenses', expenseRoutes);

app.get('/', (req, res) => {
  res.send('Servidor está funcionando!');
});

// Middleware de tratamento de erros
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Algo deu errado!');
});

// export const server = app.listen(port, () => {
//   console.log(`Servidor rodando em http://localhost:${port}`);
// });