import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

// Define um tipo para o usuário com a propriedade 'role'
interface User extends passport.User {
  role?: string;
}

// Estende a interface Request para incluir a propriedade 'user'
export interface RequestWithUser extends Request {
  user?: User;
  isAuthenticated(): boolean;
}

export const checkRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!(req as RequestWithUser).isAuthenticated()) {
      return res.status(401).json({ message: 'Não autenticado' });
    }

    const user = (req as RequestWithUser).user as User;

    if (!user || !user.role || !roles.includes(user.role)) {
      return res.status(403).json({ message: 'Não autorizado' });
    }

    next();
  };
};