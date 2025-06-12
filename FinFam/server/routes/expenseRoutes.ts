import express, { Request, Response, NextFunction } from 'express';
import { db } from '../server';
import { expenses } from '../models/Expense';
import { checkRole, RequestWithUser } from '../middleware/authMiddleware';
import { withRoleAndFamilyAccess } from '../middleware/familyAccessMiddleware';
import { eq } from 'drizzle-orm';
import { validate, validateParams, budgetExpenseSchema, idParamSchema, familyIdParamSchema } from '../middleware/validationMiddleware';
import { NotFoundError } from '../middleware/errorMiddleware';

const router = express.Router();

// Rota para criar uma despesa
router.post('/', 
  validate(budgetExpenseSchema),
  withRoleAndFamilyAccess(['admin', 'user'], async (req, res) => {
    try {
      const { category, value, date, familyId } = req.body;
      
      const newExpense = await db.insert(expenses).values({ 
        category, 
        value, 
        date: new Date(date), 
        familyId 
      }).returning();
      
      res.status(201).json(newExpense[0]);
    } catch (error) {
      throw error;
    }
  })
);

// Rota para listar todas as despesas de uma família
router.get('/family/:familyId', 
  validateParams(familyIdParamSchema),
  withRoleAndFamilyAccess(['admin', 'user'], async (req, res) => {
    try {
      const { familyId } = req.params;
      
      const familyExpenses = await db.select()
        .from(expenses)
        .where(eq(expenses.familyId, parseInt(familyId)));
        
      res.status(200).json(familyExpenses);
    } catch (error) {
      throw error;
    }
  })
);

// Middleware para verificar acesso à despesa específica
const checkExpenseAccess = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    // Obter a despesa para verificar a família
    const expense = await db.select().from(expenses).where(eq(expenses.id, parseInt(id)));
    
    if (!expense || expense.length === 0) {
      throw new NotFoundError('Despesa');
    }
    
    // Adicionar o familyId aos params para verificação de acesso
    req.params.familyId = expense[0].familyId.toString();
    next();
  } catch (error) {
    next(error);
  }
};

// Rota para obter uma despesa por ID
router.get('/:id', 
  validateParams(idParamSchema),
  checkExpenseAccess,
  withRoleAndFamilyAccess(['admin', 'user'], async (req, res) => {
    try {
      const { id } = req.params;
      
      const expense = await db.select()
        .from(expenses)
        .where(eq(expenses.id, parseInt(id)));
      
      res.status(200).json(expense[0]);
    } catch (error) {
      throw error;
    }
  })
);

// Rota para atualizar uma despesa
router.put('/:id', 
  validateParams(idParamSchema),
  validate(budgetExpenseSchema),
  checkExpenseAccess,
  withRoleAndFamilyAccess(['admin', 'user'], async (req, res) => {
    try {
      const { id } = req.params;
      const { category, value, date, familyId } = req.body;
      
      const updatedExpense = await db.update(expenses)
        .set({ 
          category, 
          value, 
          date: new Date(date), 
          familyId 
        })
        .where(eq(expenses.id, parseInt(id)))
        .returning();
        
      res.status(200).json(updatedExpense[0]);
    } catch (error) {
      throw error;
    }
  })
);

// Rota para deletar uma despesa
router.delete('/:id', 
  validateParams(idParamSchema),
  checkExpenseAccess,
  withRoleAndFamilyAccess(['admin', 'user'], async (req, res) => {
    try {
      const { id } = req.params;
      
      await db.delete(expenses)
        .where(eq(expenses.id, parseInt(id)))
        .returning();
        
      res.status(200).json({ message: 'Despesa deletada com sucesso' });
    } catch (error) {
      throw error;
    }
  })
);

export default router;