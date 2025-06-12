import express, { Request, Response, NextFunction } from 'express';
import { db } from '../server';
import { budgets } from '../models/Budget';
import { checkRole, RequestWithUser } from '../middleware/authMiddleware';
import { withRoleAndFamilyAccess } from '../middleware/familyAccessMiddleware';
import { eq } from 'drizzle-orm';
import { validate, validateParams, budgetExpenseSchema, idParamSchema, familyIdParamSchema } from '../middleware/validationMiddleware';
import { NotFoundError } from '../middleware/errorMiddleware';

const router = express.Router();

// Rota para criar um orçamento
router.post('/', 
  validate(budgetExpenseSchema),
  withRoleAndFamilyAccess(['admin', 'user'], async (req, res) => {
    try {
      const { category, value, date, familyId } = req.body;
      
      const newBudget = await db.insert(budgets).values({ 
        category, 
        value, 
        date: new Date(date), 
        familyId 
      }).returning();
      
      res.status(201).json(newBudget[0]);
    } catch (error) {
      throw error;
    }
  })
);

// Rota para listar todos os orçamentos de uma família
router.get('/family/:familyId', 
  validateParams(familyIdParamSchema),
  withRoleAndFamilyAccess(['admin', 'user'], async (req, res) => {
    try {
      const { familyId } = req.params;
      
      const familyBudgets = await db.select()
        .from(budgets)
        .where(eq(budgets.familyId, parseInt(familyId)));
        
      res.status(200).json(familyBudgets);
    } catch (error) {
      throw error;
    }
  })
);

// Middleware para verificar acesso ao orçamento específico
const checkBudgetAccess = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    // Obter o orçamento para verificar a família
    const budget = await db.select().from(budgets).where(eq(budgets.id, parseInt(id)));
    
    if (!budget || budget.length === 0) {
      throw new NotFoundError('Orçamento');
    }
    
    // Adicionar o familyId aos params para verificação de acesso
    req.params.familyId = budget[0].familyId.toString();
    next();
  } catch (error) {
    next(error);
  }
};

// Rota para obter um orçamento por ID
router.get('/:id', 
  validateParams(idParamSchema),
  checkBudgetAccess,
  withRoleAndFamilyAccess(['admin', 'user'], async (req, res) => {
    try {
      const { id } = req.params;
      
      const budget = await db.select()
        .from(budgets)
        .where(eq(budgets.id, parseInt(id)));
      
      res.status(200).json(budget[0]);
    } catch (error) {
      throw error;
    }
  })
);

// Rota para atualizar um orçamento
router.put('/:id', 
  validateParams(idParamSchema),
  validate(budgetExpenseSchema),
  checkBudgetAccess,
  withRoleAndFamilyAccess(['admin', 'user'], async (req, res) => {
    try {
      const { id } = req.params;
      const { category, value, date, familyId } = req.body;
      
      const updatedBudget = await db.update(budgets)
        .set({ 
          category, 
          value, 
          date: new Date(date), 
          familyId 
        })
        .where(eq(budgets.id, parseInt(id)))
        .returning();
        
      res.status(200).json(updatedBudget[0]);
    } catch (error) {
      throw error;
    }
  })
);

// Rota para deletar um orçamento
router.delete('/:id', 
  validateParams(idParamSchema),
  checkBudgetAccess,
  withRoleAndFamilyAccess(['admin', 'user'], async (req, res) => {
    try {
      const { id } = req.params;
      
      await db.delete(budgets)
        .where(eq(budgets.id, parseInt(id)))
        .returning();
        
      res.status(200).json({ message: 'Orçamento deletado com sucesso' });
    } catch (error) {
      throw error;
    }
  })
);

export default router;