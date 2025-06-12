import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { users, NewUser } from '../models/User';
import { db } from '../server';
import { eq } from 'drizzle-orm';
import { checkRole, RequestWithUser, User } from '../middleware/authMiddleware';
import { validate, userRegistrationSchema, userLoginSchema } from '../middleware/validationMiddleware';
import { AuthenticationError, AuthorizationError } from '../middleware/errorMiddleware';
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

// Rota de registro
router.post('/register', 
  validate(userRegistrationSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password, role } = req.body;

      // Verificar se o email já está em uso
      const existingUser = await db.select().from(users).where(eq(users.email, email));
      if (existingUser.length > 0) {
        throw new AuthenticationError('Email já está em uso.');
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
  }
);

// Rota de login
router.post('/login', 
  validate(userLoginSchema),
  (req: Request, res: Response, next: NextFunction) => {
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
  }
);

// Rota de logout
router.post('/logout', (req: Request, res: Response, next: NextFunction) => {
  req.logout((err: Error) => {
    if (err) {
      return next(err);
    }
    res.status(200).json({ message: 'Logout realizado com sucesso!' });
  });
});

// Middleware para verificar token JWT
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('Token não fornecido');
    }
    
    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET as string;
    
    jwt.verify(token, secret, (err: Error | null, decoded: any) => {
      if (err) {
        throw new AuthenticationError('Token inválido ou expirado');
      }
      
      (req as RequestWithUser).user = decoded as User;
      next();
    });
  } catch (error) {
    next(error);
  }
};

// Rota para verificar o token e obter informações do usuário
router.get('/me', verifyToken, (req: Request, res: Response, next: NextFunction) => {
  try {
    const userReq = req as RequestWithUser;
    if (!userReq.user) {
      throw new AuthenticationError('Não autenticado');
    }
    
    res.status(200).json({
      user: {
        id: userReq.user.id,
        name: userReq.user.name,
        email: userReq.user.email,
        role: userReq.user.role
      }
    });
  } catch (error) {
    next(error);
  }
});

// Rota protegida para administradores
router.get('/admin', verifyToken, checkRole(['admin']), (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({ message: 'Acesso de administrador concedido' });
  } catch (error) {
    next(error);
  }
});

// Rota protegida para usuários
router.get('/user', verifyToken, checkRole(['user', 'admin']), (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({ message: 'Acesso de usuário concedido' });
  } catch (error) {
    next(error);
  }
});

export default router;