import { api } from '../utils/api';
import { z } from 'zod';

// Esquema de validação para orçamento
export const budgetSchema = z.object({
  id: z.number(),
  familyId: z.number(),
  category: z.string().min(1, 'Categoria é obrigatória'),
  value: z.number().min(0, 'Valor deve ser maior ou igual a zero'),
  date: z.string().or(z.date())
});

// Esquema para criação de orçamento
export const createBudgetSchema = z.object({
  familyId: z.number(),
  category: z.string().min(1, 'Categoria é obrigatória'),
  value: z.number().min(0, 'Valor deve ser maior ou igual a zero'),
  date: z.string().or(z.date())
});

// Esquema para atualização de orçamento
export const updateBudgetSchema = createBudgetSchema;

// Tipos inferidos dos esquemas
export type Budget = z.infer<typeof budgetSchema>;
export type CreateBudgetData = z.infer<typeof createBudgetSchema>;
export type UpdateBudgetData = z.infer<typeof updateBudgetSchema>;

// Classe de serviço de orçamento
class BudgetService {
  // Método para listar todos os orçamentos de uma família
  async listBudgets(familyId: number): Promise<Budget[]> {
    const response = await api.get<Budget[]>(`/budgets/family/${familyId}`);
    return response.data;
  }

  // Método para obter detalhes de um orçamento específico
  async getBudget(id: number): Promise<Budget> {
    const response = await api.get<Budget>(`/budgets/${id}`);
    return response.data;
  }

  // Método para criar um novo orçamento
  async createBudget(data: CreateBudgetData): Promise<Budget> {
    const response = await api.post<Budget>('/budgets', data);
    return response.data;
  }

  // Método para atualizar um orçamento existente
  async updateBudget(id: number, data: UpdateBudgetData): Promise<Budget> {
    const response = await api.put<Budget>(`/budgets/${id}`, data);
    return response.data;
  }

  // Método para excluir um orçamento
  async deleteBudget(id: number): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/budgets/${id}`);
    return response.data;
  }
}

// Exporta uma instância única do serviço
export const budgetService = new BudgetService();