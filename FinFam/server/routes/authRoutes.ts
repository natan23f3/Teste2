import express from 'express';
import bcrypt from 'bcrypt';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { users, NewUser } from '../models/User';
import { db } from '../server';
import { eq } from 'drizzle-orm';
import { checkRole, RequestWithUser, User } from '../middleware/authMiddleware';
import * as dotenv from 'dotenv';

// Carrega as variáveis de ambiente
dotenv.config();

// Verifica se as variáveis de ambiente necessárias estão definidas
if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET não definida no arquivo .env');
  process.exit(1);
}

const router = express.Router();

// Função para gerar token JWT
const generateToken = (user: User): string => {
  const secret = process.env.JWT_SECRET as string;
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role 
    },
    secret,
    { expiresIn }
  );
};

// Middleware para validar dados de registro
const validateRegistration = (req: any, res: any, next: any) => {
  const { name, email, password, role } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ 
      message: 'Dados incompletos. Nome, email e senha são obrigatórios.' 
    });
  }
  
  // Validação básica de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Email inválido.' });
  }
  
  // Validação de senha (mínimo 8 caracteres)
  if (password.length < 8) {
    return res.status(400).json({ 
      message: 'A senha deve ter pelo menos 8 caracteres.' 
    });
  }
  
  next();
};

// Rota de registro
router.post('/register', validateRegistration, async (req: any, res: any, next: any) => {
  try {
    const { name, email, password, role } = req.body;

    // Verificar se o email já está em uso
    const existingUser = await db.select().from(users).where(eq(users.email, email));
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Email já está em uso.' });
    }

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar um novo usuário
    const newUser: NewUser = {
      name,
      email,
      password: hashedPassword,
      role: role || 'user',
    };

    // Salvar o usuário no banco de dados
    const result = await db.insert(users).values(newUser).returning();
    const user = result[0];

    // Gerar token JWT
    const token = generateToken(user);

    res.status(201).json({
      message: 'Usuário registrado com sucesso!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    next(error);
  }
});

// Rota de login
router.post('/login', (req: any, res: any, next: any) => {
  passport.authenticate('local', (err: Error, user: User, info: { message: string }) => {
    if (err) { 
      return next(err); 
    }
    
    if (!user) {
      return res.status(401).json({ message: info.message });
    }
    
    req.logIn(user, (err: Error) => {
      if (err) { 
        return next(err); 
      }
      
      // Gerar token JWT
      const token = generateToken(user);
      
      return res.status(200).json({ 
        message: 'Login realizado com sucesso!',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token 
      });
    });
  })(req, res, next);
});

// Rota de logout
router.post('/logout', (req: any, res: any, next: any) => {
  req.logout((err: Error) => {
    if (err) {
      return next(err);
    }
    res.status(200).json({ message: 'Logout realizado com sucesso!' });
  });
});

// Middleware para verificar token JWT
export const verifyToken = (req: any, res: any, next: any) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }
    
    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET as string;
    
    jwt.verify(token, secret, (err: Error | null, decoded: any) => {
      if (err) {
        return res.status(401).json({ message: 'Token inválido ou expirado' });
      }
      
      req.user = decoded;
      next();
    });
  } catch (error) {
    next(error);
  }
};

// Rota para verificar o token e obter informações do usuário
router.get('/me', verifyToken, (req: any, res: any, next: any) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Não autenticado' });
    }
    
    res.status(200).json({
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
      }
    });
  } catch (error) {
    next(error);
  }
});

// Rota protegida para administradores
router.get('/admin', verifyToken, checkRole(['admin']), (req: any, res: any, next: any) => {
  try {
    res.status(200).json({ message: 'Acesso de administrador concedido' });
  } catch (error) {
    next(error);
  }
});

// Rota protegida para usuários
router.get('/user', verifyToken, checkRole(['user', 'admin']), (req: any, res: any, next: any) => {
  try {
    res.status(200).json({ message: 'Acesso de usuário concedido' });
  } catch (error) {
    next(error);
  }
});

export default router;