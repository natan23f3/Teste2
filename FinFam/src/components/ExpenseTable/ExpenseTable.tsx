import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../UI/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../UI/Table';
import { Button } from '../UI/Button';
import { Modal } from '../UI/Modal';
import { Pagination } from '../UI/Pagination';
import { useExpense } from '../../hooks/useExpense';
import { useBudget } from '../../hooks/useBudget';
import { Expense } from '../../services/expenseService';
import ExpenseForm from './ExpenseForm';
import ExpenseFilter, { ExpenseFilterValues } from './ExpenseFilter';
import ExpenseDetail from './ExpenseDetail';

// Estendendo a interface Expense para incluir descrição opcional
interface ExtendedExpense extends Expense {
  description?: string;
}

const ExpenseTable: React.FC = () => {
  const { expenses, isLoadingExpenses, deleteExpense, isDeleting } = useExpense();
  const { budgets } = useBudget();
  
  // Estados para gerenciar a interface
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
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
  
  const itemsPerPage = 10;

  // Obter categorias únicas
  const categoriesSet = new Set<string>();
  expenses.forEach(expense => categoriesSet.add(expense.category));
  const categories = Array.from(categoriesSet);

  // Filtrar e ordenar despesas
  const filteredExpenses = expenses
    .filter(expense => {
      // Filtro por termo de busca
      const searchMatch = !filters.searchTerm || 
        expense.category.toLowerCase().includes(filters.searchTerm.toLowerCase());
      
      // Filtro por categoria
      const categoryMatch = !filters.category || expense.category === filters.category;
      
      // Filtro por data
      const expenseDate = new Date(expense.date);
      const dateFromMatch = !filters.dateFrom || expenseDate >= filters.dateFrom;
      const dateToMatch = !filters.dateTo || expenseDate <= filters.dateTo;
      
      // Filtro por valor
      const minValueMatch = !filters.minValue || expense.value >= parseFloat(filters.minValue);
      const maxValueMatch = !filters.maxValue || expense.value <= parseFloat(filters.maxValue);
      
      return searchMatch && categoryMatch && dateFromMatch && dateToMatch && minValueMatch && maxValueMatch;
    })
    .sort((a, b) => {
      // Ordenação
      if (filters.sortBy === 'date') {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return filters.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      } else if (filters.sortBy === 'value') {
        return filters.sortOrder === 'asc' ? a.value - b.value : b.value - a.value;
      } else if (filters.sortBy === 'category') {
        return filters.sortOrder === 'asc' 
          ? a.category.localeCompare(b.category)
          : b.category.localeCompare(a.category);
      }
      return 0;
    });

  // Paginação
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
  const paginatedExpenses = filteredExpenses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  const handleResetFilters = () => {
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
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  // Encontrar despesas relacionadas à categoria do item selecionado
  const getRelatedExpenses = (expense: ExtendedExpense) => {
    return expenses.filter(e => e.category === expense.category && e.id !== expense.id);
  };

  if (isLoadingExpenses) {
    return <div className="animate-pulse">Carregando despesas...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Cabeçalho e Botões de Ação */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h2 className="text-xl font-semibold">Gerenciamento de Despesas</h2>
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

      {/* Tabela de Despesas */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Lista de Despesas</h3>
            <div className="text-sm text-gray-500">
              {filteredExpenses.length} {filteredExpenses.length === 1 ? 'despesa' : 'despesas'} encontradas
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {paginatedExpenses.length > 0 ? (
            <>
              <Table hoverable>
                <TableHeader>
                  <TableRow>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>{expense.category}</TableCell>
                      <TableCell>R$ {expense.value.toFixed(2)}</TableCell>
                      <TableCell>
                        {new Date(expense.date).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="xs" 
                            onClick={() => handleOpenDetail(expense as ExtendedExpense)}
                          >
                            Ver
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="xs" 
                            onClick={() => handleOpenForm(expense as ExtendedExpense)}
                          >
                            Editar
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="xs" 
                            onClick={() => handleDeleteExpense(expense.id)}
                            disabled={isDeleting}
                          >
                            Excluir
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {totalPages > 1 && (
                <div className="mt-4 flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Nenhuma despesa encontrada com os filtros atuais.
              </p>
              <Button 
                variant="outline" 
                onClick={handleResetFilters}
              >
                Limpar Filtros
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Filtro */}
      <Modal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        title="Filtrar Despesas"
      >
        <ExpenseFilter
          initialValues={filters}
          onFilter={handleApplyFilters}
          onReset={handleResetFilters}
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

export default ExpenseTable;