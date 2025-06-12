import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { Modal } from '../components/UI/Modal';
import { useBudget } from '../hooks/useBudget';
import { useExpense } from '../hooks/useExpense';
import { Budget } from '../services/budgetService';
import BudgetForm from '../components/BudgetForm/BudgetForm';
import BudgetList from '../components/BudgetForm/BudgetList';
import BudgetDetail from '../components/BudgetForm/BudgetDetail';

const BudgetPage: React.FC = () => {
  const { budgets, isLoadingBudgets, deleteBudget, isDeleting } = useBudget();
  const { expenses } = useExpense();
  
  // Estados para gerenciar a interface
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);

  // Manipuladores de eventos
  const handleOpenForm = (budget?: Budget) => {
    setSelectedBudget(budget || null);
    setIsFormOpen(true);
  };

  const handleOpenDetail = (budget: Budget) => {
    setSelectedBudget(budget);
    setIsDetailOpen(true);
  };

  const handleDeleteBudget = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este orçamento?')) {
      try {
        await deleteBudget(id);
      } catch (error) {
        console.error('Erro ao excluir orçamento:', error);
      }
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedBudget(null);
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h1 className="text-2xl font-bold">Gerenciamento de Orçamentos</h1>
        <Button 
          onClick={() => handleOpenForm()}
        >
          Novo Orçamento
        </Button>
      </div>

      {/* Resumo de Orçamentos */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Resumo de Orçamentos</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Orçado</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                R$ {budgets.reduce((sum, budget) => sum + budget.value, 0).toFixed(2)}
              </p>
            </div>
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Gasto</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                R$ {expenses.reduce((sum, expense) => sum + expense.value, 0).toFixed(2)}
              </p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Saldo</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                R$ {(
                  budgets.reduce((sum, budget) => sum + budget.value, 0) -
                  expenses.reduce((sum, expense) => sum + expense.value, 0)
                ).toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Orçamentos */}
      <BudgetList
        budgets={budgets}
        expenses={expenses}
        isLoading={isLoadingBudgets || isDeleting}
        onViewDetail={handleOpenDetail}
        onEdit={handleOpenForm}
        onDelete={handleDeleteBudget}
      />

      {/* Modal de Formulário */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedBudget ? 'Editar Orçamento' : 'Novo Orçamento'}
      >
        <BudgetForm
          budget={selectedBudget || undefined}
          onSuccess={handleFormSuccess}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      {/* Modal de Detalhes */}
      {selectedBudget && (
        <Modal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title="Detalhes do Orçamento"
          size="2xl"
        >
          <BudgetDetail
            budget={selectedBudget}
            expenses={expenses.filter(expense => expense.category === selectedBudget.category)}
            onEdit={(budget) => {
              setIsDetailOpen(false);
              handleOpenForm(budget);
            }}
            onClose={() => setIsDetailOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default BudgetPage;