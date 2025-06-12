import { api } from '../utils/api';
import { z } from 'zod';

// Esquema de validação para despesa
export const expenseSchema = z.object({
  id: z.number(),
  familyId: z.number(),
  category: z.string().min(1, 'Categoria é obrigatória'),
  value: z.number().min(0, 'Valor deve ser maior ou igual a zero'),
  date: z.string().or(z.date())
});

// Esquema para criação de despesa
export const createExpenseSchema = z.object({
  familyId: z.number(),
  category: z.string().min(1, 'Categoria é obrigatória'),
  value: z.number().min(0, 'Valor deve ser maior ou igual a zero'),
  date: z.string().or(z.date())
});

// Esquema para atualização de despesa
export const updateExpenseSchema = createExpenseSchema;

// Tipos inferidos dos esquemas
export type Expense = z.infer<typeof expenseSchema>;
export type CreateExpenseData = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseData = z.infer<typeof updateExpenseSchema>;

// Classe de serviço de despesa
class ExpenseService {
  // Método para listar todas as despesas de uma família
  async listExpenses(familyId: number): Promise<Expense[]> {
    const response = await api.get<Expense[]>(`/expenses/family/${familyId}`);
    return response.data;
  }

  // Método para obter detalhes de uma despesa específica
  async getExpense(id: number): Promise<Expense> {
    const response = await api.get<Expense>(`/expenses/${id}`);
    return response.data;
  }

  // Método para criar uma nova despesa
  async createExpense(data: CreateExpenseData): Promise<Expense> {
    const response = await api.post<Expense>('/expenses', data);
    return response.data;
  }

  // Método para atualizar uma despesa existente
  async updateExpense(id: number, data: UpdateExpenseData): Promise<Expense> {
    const response = await api.put<Expense>(`/expenses/${id}`, data);
    return response.data;
  }

  // Método para excluir uma despesa
  async deleteExpense(id: number): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/expenses/${id}`);
    return response.data;
  }
}

// Exporta uma instância única do serviço
export const expenseService = new ExpenseService();