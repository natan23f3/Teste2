import express, { Request, Response, NextFunction } from 'express';
import { db } from '../server';
import { budgets } from '../models/Budget';
import { families } from '../models/Family';
import { checkRole, RequestWithUser } from '../middleware/authMiddleware';
import { eq, and } from 'drizzle-orm';

const router = express.Router();

// Middleware para verificar se o usuário tem acesso à família
const checkFamilyAccess = async (req: RequestWithUser, res: Response, next: NextFunction) => {
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

    // Verificar se o usuário pertence à família
    const familyResult = await db.select()
      .from(families)
      .where(
        and(
          eq(families.id, parseInt(familyIdToCheck)),
          eq(families.adminId, req.user.id)
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
const withRoleAndFamilyAccess = (roles: string[], handler: (req: Request, res: Response) => Promise<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Verificar função do usuário
    checkRole(roles)(req, res, next);
    if (res.headersSent) {
      return;
    }
    
    // Verificar acesso à família
    await checkFamilyAccess(req as RequestWithUser, res, next);
    if (res.headersSent) {
      return;
    }
    
    try {
      await handler(req, res);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  };
};

// Rota para criar um orçamento
router.post('/', withRoleAndFamilyAccess(['admin', 'user'], async (req, res) => {
  try {
    const { category, value, date, familyId } = req.body;
    
    // Validar dados de entrada
    if (!category || !value || !date || !familyId) {
      return res.status(400).json({ message: 'Dados incompletos. Categoria, valor, data e ID da família são obrigatórios.' });
    }
    
    const newBudget = await db.insert(budgets).values({ 
      category, 
      value, 
      date: new Date(date), 
      familyId 
    }).returning();
    
    res.status(201).json(newBudget);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar orçamento' });
  }
}));

// Rota para listar todos os orçamentos de uma família
router.get('/family/:familyId', withRoleAndFamilyAccess(['admin', 'user'], async (req, res) => {
  try {
    const { familyId } = req.params;
    
    const familyBudgets = await db.select()
      .from(budgets)
      .where(eq(budgets.familyId, parseInt(familyId)));
      
    res.status(200).json(familyBudgets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao listar orçamentos' });
  }
}));

// Rota para obter um orçamento por ID
router.get('/:id', withRoleAndFamilyAccess(['admin', 'user'], async (req, res) => {
  try {
    const { id } = req.params;
    const budget = await db.select().from(budgets).where(eq(budgets.id, parseInt(id)));
    
    if (!budget || budget.length === 0) {
      return res.status(404).json({ message: 'Orçamento não encontrado' });
    }
    
    // Adicionar o familyId aos params para verificação de acesso
    req.params.familyId = budget[0].familyId.toString();
    
    res.status(200).json(budget[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao obter orçamento' });
  }
}));

// Rota para atualizar um orçamento
router.put('/:id', withRoleAndFamilyAccess(['admin', 'user'], async (req, res) => {
  try {
    const { id } = req.params;
    const { category, value, date, familyId } = req.body;
    
    // Validar dados de entrada
    if (!category || !value || !date || !familyId) {
      return res.status(400).json({ message: 'Dados incompletos. Categoria, valor, data e ID da família são obrigatórios.' });
    }
    
    const updatedBudget = await db.update(budgets)
      .set({ 
        category, 
        value, 
        date: new Date(date), 
        familyId 
      })
      .where(eq(budgets.id, parseInt(id)))
      .returning();
      
    if (!updatedBudget || updatedBudget.length === 0) {
      return res.status(404).json({ message: 'Orçamento não encontrado' });
    }
    
    res.status(200).json(updatedBudget[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar orçamento' });
  }
}));

// Rota para deletar um orçamento
router.delete('/:id', withRoleAndFamilyAccess(['admin', 'user'], async (req, res) => {
  try {
    const { id } = req.params;
    
    // Primeiro, obter o orçamento para verificar a família
    const budgetToDelete = await db.select().from(budgets).where(eq(budgets.id, parseInt(id)));
    
    if (!budgetToDelete || budgetToDelete.length === 0) {
      return res.status(404).json({ message: 'Orçamento não encontrado' });
    }
    
    // Adicionar o familyId aos params para verificação de acesso
    req.params.familyId = budgetToDelete[0].familyId.toString();
    
    const deletedBudget = await db.delete(budgets)
      .where(eq(budgets.id, parseInt(id)))
      .returning();
      
    res.status(200).json({ message: 'Orçamento deletado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao deletar orçamento' });
  }
}));

export default router;