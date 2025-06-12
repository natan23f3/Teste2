import { Request, Response, NextFunction } from 'express';
import { db } from '../server';
import { families } from '../models/Family';
import { eq, and, or } from 'drizzle-orm';
import { RequestWithUser, User } from './authMiddleware';
import { NotFoundError, AuthorizationError } from './errorMiddleware';

// Middleware para verificar se o usuário tem acesso à família
export const checkFamilyAccess = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Não autenticado' });
    }

    const { familyId } = req.body;
    
    // Se não houver familyId no body, verificar se está nos params
    const familyIdToCheck = familyId || req.params.familyId;
    
    if (!familyIdToCheck) {
      return res.status(400).json({ message: 'ID da família não fornecido' });
    }

    // Verificar se o usuário é admin do sistema
    if (req.user.role === 'admin') {
      return next();
    }

    // Verificar se o usuário pertence à família (como admin ou membro)
    const familyResult = await db.select()
      .from(families)
      .where(
        and(
          eq(families.id, parseInt(familyIdToCheck)),
          or(
            eq(families.adminId, req.user.id),
            // Aqui poderia ser adicionada uma verificação para membros da família
            // quando essa funcionalidade for implementada
          )
        )
      );

    if (!familyResult || familyResult.length === 0) {
      return res.status(403).json({ message: 'Acesso negado a esta família' });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao verificar acesso à família' });
  }
};

// Função auxiliar para combinar middleware e handler
export const withRoleAndFamilyAccess = (roles: string[], handler: (req: Request, res: Response) => Promise<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userReq = req as RequestWithUser;
      
      // Verificar função do usuário
      if (!userReq.user) {
        throw new AuthorizationError('Não autenticado');
      }

      // Verificar se o usuário tem a função necessária
      if (!userReq.user.role || !roles.includes(userReq.user.role)) {
        throw new AuthorizationError('Não autorizado para esta operação');
      }
      
      // Verificar acesso à família
      await checkFamilyAccess(userReq, res, next);
      if (res.headersSent) {
        return;
      }
      
      // Executar o handler
      await handler(req, res);
    } catch (error) {
      next(error);
    }
  };
};