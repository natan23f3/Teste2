import express, { Request, Response, NextFunction } from 'express';
import { db } from '../server';
import { expenses } from '../models/Expense';
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

// Rota para criar uma despesa
router.post('/', withRoleAndFamilyAccess(['admin', 'user'], async (req, res) => {
  try {
    const { category, value, date, familyId } = req.body;
    
    // Validar dados de entrada
    if (!category || !value || !date || !familyId) {
      return res.status(400).json({ message: 'Dados incompletos. Categoria, valor, data e ID da família são obrigatórios.' });
    }
    
    const newExpense = await db.insert(expenses).values({ 
      category, 
      value, 
      date: new Date(date), 
      familyId 
    }).returning();
    
    res.status(201).json(newExpense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar despesa' });
  }
}));

// Rota para listar todas as despesas de uma família
router.get('/family/:familyId', withRoleAndFamilyAccess(['admin', 'user'], async (req, res) => {
  try {
    const { familyId } = req.params;
    
    const familyExpenses = await db.select()
      .from(expenses)
      .where(eq(expenses.familyId, parseInt(familyId)));
      
    res.status(200).json(familyExpenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao listar despesas' });
  }
}));

// Rota para obter uma despesa por ID
router.get('/:id', withRoleAndFamilyAccess(['admin', 'user'], async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await db.select().from(expenses).where(eq(expenses.id, parseInt(id)));
    
    if (!expense || expense.length === 0) {
      return res.status(404).json({ message: 'Despesa não encontrada' });
    }
    
    // Adicionar o familyId aos params para verificação de acesso
    req.params.familyId = expense[0].familyId.toString();
    
    res.status(200).json(expense[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao obter despesa' });
  }
}));

// Rota para atualizar uma despesa
router.put('/:id', withRoleAndFamilyAccess(['admin', 'user'], async (req, res) => {
  try {
    const { id } = req.params;
    const { category, value, date, familyId } = req.body;
    
    // Validar dados de entrada
    if (!category || !value || !date || !familyId) {
      return res.status(400).json({ message: 'Dados incompletos. Categoria, valor, data e ID da família são obrigatórios.' });
    }
    
    const updatedExpense = await db.update(expenses)
      .set({ 
        category, 
        value, 
        date: new Date(date), 
        familyId 
      })
      .where(eq(expenses.id, parseInt(id)))
      .returning();
      
    if (!updatedExpense || updatedExpense.length === 0) {
      return res.status(404).json({ message: 'Despesa não encontrada' });
    }
    
    res.status(200).json(updatedExpense[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar despesa' });
  }
}));

// Rota para deletar uma despesa
router.delete('/:id', withRoleAndFamilyAccess(['admin', 'user'], async (req, res) => {
  try {
    const { id } = req.params;
    
    // Primeiro, obter a despesa para verificar a família
    const expenseToDelete = await db.select().from(expenses).where(eq(expenses.id, parseInt(id)));
    
    if (!expenseToDelete || expenseToDelete.length === 0) {
      return res.status(404).json({ message: 'Despesa não encontrada' });
    }
    
    // Adicionar o familyId aos params para verificação de acesso
    req.params.familyId = expenseToDelete[0].familyId.toString();
    
    const deletedExpense = await db.delete(expenses)
      .where(eq(expenses.id, parseInt(id)))
      .returning();
      
    res.status(200).json({ message: 'Despesa deletada com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao deletar despesa' });
  }
}));

export default router;