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
import flash from 'connect-flash';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

// Verifica se as variáveis de ambiente necessárias estão definidas
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL não definida no arquivo .env');
  process.exit(1);
}

if (!process.env.SESSION_SECRET) {
  console.error('SESSION_SECRET não definida no arquivo .env');
  process.exit(1);
}

export const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Configurações de segurança básicas
app.use(helmet()); // Adiciona vários cabeçalhos HTTP de segurança

// Configuração de CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Configuração de rate limiting global
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite de 100 requisições por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Muitas requisições deste IP, tente novamente após 15 minutos'
});

// Aplicar rate limiting global
app.use(globalLimiter);

// Rate limiting específico para rotas de autenticação (mais restritivo)
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10, // limite de 10 tentativas por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Muitas tentativas de login, tente novamente após 1 hora'
});

// Middleware para parsing de JSON
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Configuração da conexão com o banco de dados
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false
});

export const db = drizzle(pool);

// Configuração da sessão
app.use(session({
  secret: process.env.SESSION_SECRET as string,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: isProduction, // Use HTTPS em produção
    httpOnly: true, // Previne ataques XSS
    maxAge: 24 * 60 * 60 * 1000, // 24 horas
    sameSite: 'strict' // Previne ataques CSRF
  }
}));

// Configuração do Passport
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Rotas da API com rate limiting específico para autenticação
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/expenses', expenseRoutes);

// Rota de status
app.get('/api/status', (req, res) => {
  res.status(200).json({ status: 'online', version: '1.0.0' });
});

// Rota raiz
app.get('/', (req, res) => {
  res.send('FinFam API está funcionando!');
});

// Middleware para rotas não encontradas
app.use((req, res, next) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

// Middleware de tratamento de erros
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Erro:', err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erro interno do servidor';
  
  res.status(statusCode).json({
    status: 'error',
    message: message,
    errors: err.errors
  });
});

// Exporta o app para testes
export default app;

// Inicia o servidor se não estiver em modo de teste
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
  });
}