import express, { Request, Response, NextFunction } from 'express';
import { db } from '../server';
import { budgets } from '../models/Budget';
import { checkRole } from '../middleware/authMiddleware';
import { eq } from 'drizzle-orm';
import { RequestWithUser } from '../middleware/authMiddleware';

const router = express.Router();

// Função auxiliar para combinar middleware e handler
const withRole = (roles: string[], handler: (req: Request, res: Response) => Promise<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    checkRole(roles)(req, res, next);
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
router.post('/', withRole(['admin', 'user'], async (req, res) => {
  try {
    const { name, amount, userId } = req.body;
    const newBudget = await db.insert(budgets).values({ name, amount, userId }).returning();
    res.status(201).json(newBudget);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar orçamento' });
  }
}));

// Rota para listar todos os orçamentos
router.get('/', withRole(['admin', 'user'], async (req, res) => {
  try {
    const allBudgets = await db.select().from(budgets);
    res.status(200).json(allBudgets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao listar orçamentos' });
  }
}));

// Rota para obter um orçamento por ID
router.get('/:id', withRole(['admin', 'user'], async (req, res) => {
  try {
    const { id } = req.params;
    const budget = await db.select().from(budgets).where(eq(budgets.id, parseInt(id)));
    if (!budget || budget.length === 0) {
      return res.status(404).json({ message: 'Orçamento não encontrado' });
    }
    res.status(200).json(budget[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao obter orçamento' });
  }
}));

// Rota para atualizar um orçamento
router.put('/:id', withRole(['admin', 'user'], async (req, res) => {
  try {
    const { id } = req.params;
    const { name, amount, userId } = req.body;
    const updatedBudget = await db.update(budgets)
      .set({ name, amount, userId })
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
router.delete('/:id', withRole(['admin', 'user'], async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBudget = await db.delete(budgets).where(eq(budgets.id, parseInt(id))).returning();
    if (!deletedBudget || deletedBudget.length === 0) {
      return res.status(404).json({ message: 'Orçamento não encontrado' });
    }
    res.status(200).json({ message: 'Orçamento deletado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao deletar orçamento' });
  }
}));

export default router;