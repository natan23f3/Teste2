import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { expenseService, Expense, CreateExpenseData, UpdateExpenseData } from '../services/expenseService';
import { useFamily } from './useFamily';

/**
 * Hook personalizado para gerenciar despesas usando TanStack Query
 * 
 * @returns Funções e estados para gerenciar despesas
 */
export const useExpense = () => {
  const queryClient = useQueryClient();
  const { selectedFamily } = useFamily();
  const familyId = selectedFamily?.id;

  // Query para listar despesas da família selecionada
  const {
    data: expenses = [],
    isLoading: isLoadingExpenses,
    error: expensesError,
    refetch: refetchExpenses
  } = useQuery({
    queryKey: ['expenses', familyId],
    queryFn: () => (familyId ? expenseService.listExpenses(familyId) : Promise.resolve([])),
    enabled: !!familyId,
  });

  // Query para obter uma despesa específica
  const getExpense = (id: number) => {
    return useQuery({
      queryKey: ['expense', id],
      queryFn: () => expenseService.getExpense(id),
      enabled: !!id,
    });
  };

  // Mutation para criar uma nova despesa
  const createExpenseMutation = useMutation({
    mutationFn: (data: CreateExpenseData) => expenseService.createExpense(data),
    onSuccess: () => {
      // Invalida a query de listagem para forçar uma atualização
      if (familyId) {
        queryClient.invalidateQueries({ queryKey: ['expenses', familyId] });
      }
    },
  });

  // Mutation para atualizar uma despesa existente
  const updateExpenseMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateExpenseData }) => 
      expenseService.updateExpense(id, data),
    onSuccess: (updatedExpense: Expense) => {
      // Atualiza o cache da query de listagem e do item específico
      if (familyId) {
        queryClient.invalidateQueries({ queryKey: ['expenses', familyId] });
        queryClient.invalidateQueries({ queryKey: ['expense', updatedExpense.id] });
      }
    },
  });

  // Mutation para excluir uma despesa
  const deleteExpenseMutation = useMutation({
    mutationFn: (id: number) => expenseService.deleteExpense(id),
    onSuccess: (_: any, id: number) => {
      // Atualiza o cache da query de listagem e remove o item específico
      if (familyId) {
        queryClient.invalidateQueries({ queryKey: ['expenses', familyId] });
        queryClient.removeQueries({ queryKey: ['expense', id] });
      }
    },
  });

  // Funções auxiliares para simplificar o uso das mutations
  const createExpense = async (data: Omit<CreateExpenseData, 'familyId'>) => {
    if (!familyId) {
      throw new Error('Nenhuma família selecionada');
    }
    return createExpenseMutation.mutateAsync({ ...data, familyId });
  };

  const updateExpense = async (id: number, data: Omit<UpdateExpenseData, 'familyId'>) => {
    if (!familyId) {
      throw new Error('Nenhuma família selecionada');
    }
    return updateExpenseMutation.mutateAsync({ id, data: { ...data, familyId } });
  };

  const deleteExpense = async (id: number) => {
    return deleteExpenseMutation.mutateAsync(id);
  };

  return {
    // Dados e estados
    expenses,
    isLoadingExpenses,
    expensesError,
    
    // Funções
    getExpense,
    createExpense,
    updateExpense,
    deleteExpense,
    refetchExpenses,
    
    // Estados das mutations
    isCreating: createExpenseMutation.isPending,
    isUpdating: updateExpenseMutation.isPending,
    isDeleting: deleteExpenseMutation.isPending,
    
    // Erros das mutations
    createError: createExpenseMutation.error,
    updateError: updateExpenseMutation.error,
    deleteError: deleteExpenseMutation.error,
  };
};