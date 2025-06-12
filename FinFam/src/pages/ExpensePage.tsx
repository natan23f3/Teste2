import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { Modal } from '../components/UI/Modal';
import { useExpense } from '../hooks/useExpense';
import { useBudget } from '../hooks/useBudget';
import { Expense } from '../services/expenseService';
import ExpenseTable from '../components/ExpenseTable/ExpenseTable';
import ExpenseForm from '../components/ExpenseTable/ExpenseForm';
import ExpenseDetail from '../components/ExpenseTable/ExpenseDetail';
import ExpenseFilter, { ExpenseFilterValues } from '../components/ExpenseTable/ExpenseFilter';
import { Chart } from '../components/UI/Chart';

// Estendendo a interface Expense para incluir descrição opcional
interface ExtendedExpense extends Expense {
  description?: string;
}

const ExpensePage: React.FC = () => {
  const { expenses, isLoadingExpenses, deleteExpense, isDeleting } = useExpense();
  const { budgets } = useBudget();
  
  // Estados para gerenciar a interface
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<ExtendedExpense | null>(null);
  const [filters, setFilters] = useState<ExpenseFilterValues>({
    searchTerm: '',
    category: '',
    dateFrom: null,
    dateTo: null,
    minValue: '',
    maxValue: '',
    sortBy: 'date',
    sortOrder: 'desc'
  });

  // Obter categorias únicas
  const categoriesSet = new Set<string>();
  expenses.forEach(expense => categoriesSet.add(expense.category));
  const categories = Array.from(categoriesSet);

  // Agrupar despesas por categoria
  const expensesByCategory = expenses.reduce((acc, expense) => {
    const category = expense.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += expense.value;
    return acc;
  }, {} as Record<string, number>);

  // Preparar dados para o gráfico de pizza
  const pieChartData = Object.entries(expensesByCategory).map(([category, value]) => ({
    name: category,
    value
  }));

  // Agrupar despesas por mês (simulado para demonstração)
  const monthlyData = [
    { month: 'Jan', valor: 1200 },
    { month: 'Fev', valor: 1900 },
    { month: 'Mar', valor: 1500 },
    { month: 'Abr', valor: 1800 },
    { month: 'Mai', valor: 1200 },
    { month: 'Jun', valor: 2100 }
  ];

  // Manipuladores de eventos
  const handleOpenForm = (expense?: ExtendedExpense) => {
    setSelectedExpense(expense || null);
    setIsFormOpen(true);
  };

  const handleOpenDetail = (expense: ExtendedExpense) => {
    setSelectedExpense(expense);
    setIsDetailOpen(true);
  };

  const handleDeleteExpense = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta despesa?')) {
      try {
        await deleteExpense(id);
      } catch (error) {
        console.error('Erro ao excluir despesa:', error);
      }
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedExpense(null);
  };

  const handleApplyFilters = (newFilters: ExpenseFilterValues) => {
    setFilters(newFilters);
    setIsFilterOpen(false);
  };

  // Encontrar despesas relacionadas à categoria do item selecionado
  const getRelatedExpenses = (expense: ExtendedExpense) => {
    return expenses.filter(e => e.category === expense.category && e.id !== expense.id);
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h1 className="text-2xl font-bold">Gerenciamento de Despesas</h1>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => setIsFilterOpen(true)}
          >
            Filtrar
          </Button>
          <Button 
            onClick={() => handleOpenForm()}
          >
            Nova Despesa
          </Button>
        </div>
      </div>

      {/* Resumo de Despesas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Distribuição por Categoria */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Distribuição por Categoria</h2>
          </CardHeader>
          <CardContent className="h-80">
            {pieChartData.length > 0 ? (
              <Chart
                data={pieChartData}
                type="pie"
                series={[{ dataKey: 'value' }]}
                xAxisDataKey="name"
                size="auto"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Nenhuma despesa registrada</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Gráfico de Tendência Mensal */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Tendência Mensal</h2>
          </CardHeader>
          <CardContent className="h-80">
            <Chart
              data={monthlyData}
              type="line"
              series={[{ dataKey: 'valor', name: 'Despesas' }]}
              xAxisDataKey="month"
              size="auto"
            />
          </CardContent>
        </Card>
      </div>

      {/* Resumo Financeiro */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Resumo Financeiro</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total de Despesas</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                R$ {expenses.reduce((sum, expense) => sum + expense.value, 0).toFixed(2)}
              </p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Orçado</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                R$ {budgets.reduce((sum, budget) => sum + budget.value, 0).toFixed(2)}
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

      {/* Tabela de Despesas */}
      <ExpenseTable />

      {/* Modal de Filtro */}
      <Modal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        title="Filtrar Despesas"
      >
        <ExpenseFilter
          initialValues={filters}
          onFilter={handleApplyFilters}
          onReset={() => {
            setFilters({
              searchTerm: '',
              category: '',
              dateFrom: null,
              dateTo: null,
              minValue: '',
              maxValue: '',
              sortBy: 'date',
              sortOrder: 'desc'
            });
            setIsFilterOpen(false);
          }}
          categories={categories}
        />
      </Modal>

      {/* Modal de Formulário */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedExpense ? 'Editar Despesa' : 'Nova Despesa'}
      >
        <ExpenseForm
          expense={selectedExpense || undefined}
          onSuccess={handleFormSuccess}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      {/* Modal de Detalhes */}
      {selectedExpense && (
        <Modal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title="Detalhes da Despesa"
          size="2xl"
        >
          <ExpenseDetail
            expense={selectedExpense}
            budgets={budgets}
            relatedExpenses={getRelatedExpenses(selectedExpense)}
            onEdit={(expense) => {
              setIsDetailOpen(false);
              handleOpenForm(expense);
            }}
            onClose={() => setIsDetailOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default ExpensePage;