import { Request, Response, NextFunction } from 'express';
import { AuthenticationError, AuthorizationError } from './errorMiddleware';

// Define um tipo para o usuário com as propriedades necessárias
export interface User {
  id: number;
  role?: string;
  name?: string;
  email?: string;
}

// Estende a interface Request para incluir a propriedade 'user'
export interface RequestWithUser extends Request {
  user?: User;
}

// Middleware para verificar a função do usuário
export const checkRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const userReq = req as RequestWithUser;
      
      // Verificar se o usuário está autenticado
      if (!userReq.user) {
        throw new AuthenticationError('Não autenticado');
      }

      // Verificar se o usuário tem a função necessária
      if (!userReq.user.role || !roles.includes(userReq.user.role)) {
        throw new AuthorizationError('Não autorizado para esta operação');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// Middleware para garantir que o usuário está autenticado
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  try {
    const userReq = req as RequestWithUser;
    
    if (!userReq.user) {
      throw new AuthenticationError('Não autenticado');
    }
    
    next();
  } catch (error) {
    next(error);
  }
};