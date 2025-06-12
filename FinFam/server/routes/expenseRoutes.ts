import express, { Request, Response, NextFunction } from 'express';
import { db } from '../server';
import { expenses } from '../models/Expense';
import { checkRole } from '../middleware/authMiddleware';
import { eq } from 'drizzle-orm';

const router = express.Router();

// Função auxiliar para combinar middleware e handler
const withRole = (roles: string[], handler: (req: Request, res: Response, next: NextFunction) => Promise<Response | undefined>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    checkRole(roles)(req, res, next);
    if (res.headersSent) {
      return;
    }
    try {
      await handler(req, res, next);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  };
};

// Rota para criar uma despesa
router.post('/', (req: Request, res: Response, next: NextFunction) => withRole(['admin', 'user'], async (req, res, next) => {
  try {
    const { name, amount, date, userId } = req.body;
    const newExpense = await db.insert(expenses).values({ name, amount, date, userId }).returning();
    return res.status(201).json(newExpense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar despesa' });
  }
})(req, res, next));

// Rota para listar todas as despesas
router.get('/', (req: Request, res: Response, next: NextFunction) => withRole(['admin', 'user'], async (req, res, next) => {
  try {
    const allExpenses = await db.select().from(expenses);
    return res.status(200).json(allExpenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao listar despesas' });
  }
})(req, res, next));

// Rota para obter uma despesa por ID
router.get('/:id', (req: Request, res: Response, next: NextFunction) => withRole(['admin', 'user'], async (req, res, next) => {
  try {
    const { id } = req.params;
    const expense = await db.select().from(expenses).where(eq(expenses.id, parseInt(id)));
    if (!expense || expense.length === 0) {
      return res.status(404).json({ message: 'Despesa não encontrada' });
    }
    return res.status(200).json(expense[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao obter despesa' });
  }
})(req, res, next));

// Rota para atualizar uma despesa
router.put('/:id', (req: Request, res: Response, next: NextFunction) => withRole(['admin', 'user'], async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, amount, date, userId } = req.body;
    const updatedExpense = await db.update(expenses)
      .set({ name, amount, date, userId })
      .where(eq(expenses.id, parseInt(id)))
      .returning();
    if (!updatedExpense || updatedExpense.length === 0) {
      return res.status(404).json({ message: 'Despesa não encontrada' });
    }
    return res.status(200).json(updatedExpense[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar despesa' });
  }
})(req, res, next));

// Rota para deletar uma despesa
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => withRole(['admin', 'user'], async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedExpense = await db.delete(expenses).where(eq(expenses.id, parseInt(id))).returning();
    if (!deletedExpense || deletedExpense.length === 0) {
      return res.status(404).json({ message: 'Despesa não encontrada' });
    }
    return res.status(200).json({ message: 'Despesa deletada com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao deletar despesa' });
  }
})(req, res, next));

export default router;