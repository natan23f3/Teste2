import { Request, Response, NextFunction } from 'express';

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
  return (req: any, res: any, next: any) => {
    // Verificar se o usuário está autenticado
    if (!req.user) {
      return res.status(401).json({ message: 'Não autenticado' });
    }

    // Verificar se o usuário tem a função necessária
    if (!req.user.role || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Não autorizado' });
    }

    next();
  };
};