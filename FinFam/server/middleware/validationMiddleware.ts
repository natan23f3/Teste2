import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ValidationError } from './errorMiddleware';

// Esquema para validação de registro de usuário
export const userRegistrationSchema = z.object({
  name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(8, { message: 'Senha deve ter pelo menos 8 caracteres' }),
  role: z.enum(['admin', 'user']).optional().default('user')
});

// Esquema para validação de login
export const userLoginSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(1, { message: 'Senha é obrigatória' })
});

// Esquema para validação de orçamento e despesa
export const budgetExpenseSchema = z.object({
  category: z.string().min(1, { message: 'Categoria é obrigatória' }),
  value: z.number().positive({ message: 'Valor deve ser positivo' }),
  date: z.string().refine(
    (date) => !isNaN(Date.parse(date)), 
    { message: 'Data inválida' }
  ),
  familyId: z.number().int().positive({ message: 'ID da família inválido' })
});

// Esquema para validação de família
export const familySchema = z.object({
  name: z.string().min(1, { message: 'Nome da família é obrigatório' }),
  adminId: z.number().int().positive({ message: 'ID do administrador inválido' })
});

// Middleware de validação genérico
export const validate = (schema: z.ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.body);
      
      if (!result.success) {
        // Formatar erros de validação
        const errors: Record<string, string> = {};
        result.error.issues.forEach(issue => {
          const path = issue.path.join('.');
          errors[path] = issue.message;
        });
        
        throw new ValidationError('Erro de validação', errors);
      }
      
      // Substituir o body com os dados validados e transformados
      req.body = result.data;
      next();
    } catch (error) {
      next(error);
    }
  };
};

// Middleware para validar parâmetros de rota
export const validateParams = (schema: z.ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.params);
      
      if (!result.success) {
        // Formatar erros de validação
        const errors: Record<string, string> = {};
        result.error.issues.forEach(issue => {
          const path = issue.path.join('.');
          errors[path] = issue.message;
        });
        
        throw new ValidationError('Erro de validação nos parâmetros', errors);
      }
      
      // Substituir os params com os dados validados e transformados
      req.params = result.data;
      next();
    } catch (error) {
      next(error);
    }
  };
};

// Esquema para validação de ID
export const idParamSchema = z.object({
  id: z.string().refine(
    (id) => !isNaN(parseInt(id)) && parseInt(id) > 0,
    { message: 'ID inválido' }
  )
});

// Esquema para validação de ID de família
export const familyIdParamSchema = z.object({
  familyId: z.string().refine(
    (id) => !isNaN(parseInt(id)) && parseInt(id) > 0,
    { message: 'ID de família inválido' }
  )
});