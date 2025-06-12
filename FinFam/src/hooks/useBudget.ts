import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { budgetService, Budget, CreateBudgetData, UpdateBudgetData } from '../services/budgetService';
import { useFamily } from './useFamily';

/**
 * Hook personalizado para gerenciar orçamentos usando TanStack Query
 * 
 * @returns Funções e estados para gerenciar orçamentos
 */
export const useBudget = () => {
  const queryClient = useQueryClient();
  const { selectedFamily } = useFamily();
  const familyId = selectedFamily?.id;

  // Query para listar orçamentos da família selecionada
  const {
    data: budgets = [],
    isLoading: isLoadingBudgets,
    error: budgetsError,
    refetch: refetchBudgets
  } = useQuery({
    queryKey: ['budgets', familyId],
    queryFn: () => (familyId ? budgetService.listBudgets(familyId) : Promise.resolve([])),
    enabled: !!familyId,
  });

  // Query para obter um orçamento específico
  const getBudget = (id: number) => {
    return useQuery({
      queryKey: ['budget', id],
      queryFn: () => budgetService.getBudget(id),
      enabled: !!id,
    });
  };

  // Mutation para criar um novo orçamento
  const createBudgetMutation = useMutation({
    mutationFn: (data: CreateBudgetData) => budgetService.createBudget(data),
    onSuccess: () => {
      // Invalida a query de listagem para forçar uma atualização
      if (familyId) {
        queryClient.invalidateQueries({ queryKey: ['budgets', familyId] });
      }
    },
  });

  // Mutation para atualizar um orçamento existente
  const updateBudgetMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateBudgetData }) => 
      budgetService.updateBudget(id, data),
    onSuccess: (updatedBudget: Budget) => {
      // Atualiza o cache da query de listagem e do item específico
      if (familyId) {
        queryClient.invalidateQueries({ queryKey: ['budgets', familyId] });
        queryClient.invalidateQueries({ queryKey: ['budget', updatedBudget.id] });
      }
    },
  });

  // Mutation para excluir um orçamento
  const deleteBudgetMutation = useMutation({
    mutationFn: (id: number) => budgetService.deleteBudget(id),
    onSuccess: (_: any, id: number) => {
      // Atualiza o cache da query de listagem e remove o item específico
      if (familyId) {
        queryClient.invalidateQueries({ queryKey: ['budgets', familyId] });
        queryClient.removeQueries({ queryKey: ['budget', id] });
      }
    },
  });

  // Funções auxiliares para simplificar o uso das mutations
  const createBudget = async (data: Omit<CreateBudgetData, 'familyId'>) => {
    if (!familyId) {
      throw new Error('Nenhuma família selecionada');
    }
    return createBudgetMutation.mutateAsync({ ...data, familyId });
  };

  const updateBudget = async (id: number, data: Omit<UpdateBudgetData, 'familyId'>) => {
    if (!familyId) {
      throw new Error('Nenhuma família selecionada');
    }
    return updateBudgetMutation.mutateAsync({ id, data: { ...data, familyId } });
  };

  const deleteBudget = async (id: number) => {
    return deleteBudgetMutation.mutateAsync(id);
  };

  return {
    // Dados e estados
    budgets,
    isLoadingBudgets,
    budgetsError,
    
    // Funções
    getBudget,
    createBudget,
    updateBudget,
    deleteBudget,
    refetchBudgets,
    
    // Estados das mutations
    isCreating: createBudgetMutation.isPending,
    isUpdating: updateBudgetMutation.isPending,
    isDeleting: deleteBudgetMutation.isPending,
    
    // Erros das mutations
    createError: createBudgetMutation.error,
    updateError: updateBudgetMutation.error,
    deleteError: deleteBudgetMutation.error,
  };
};