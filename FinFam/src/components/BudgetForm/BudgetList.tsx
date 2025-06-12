import React, { useState } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../UI/Table';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { Select } from '../UI/Select';
import { Pagination } from '../UI/Pagination';
import { Card, CardHeader, CardContent } from '../UI/Card';
import { Budget } from '../../services/budgetService';
import { Expense } from '../../services/expenseService';

interface BudgetListProps {
  budgets: Budget[];
  expenses: Expense[];
  isLoading: boolean;
  onViewDetail: (budget: Budget) => void;
  onEdit: (budget: Budget) => void;
  onDelete: (budgetId: number) => void;
}

const BudgetList: React.FC<BudgetListProps> = ({
  budgets,
  expenses,
  isLoading,
  onViewDetail,
  onEdit,
  onDelete
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('category');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  const itemsPerPage = 10;

  // Obter categorias únicas
  const categoriesSet = new Set<string>();
  budgets.forEach(budget => categoriesSet.add(budget.category));
  const categories = Array.from(categoriesSet);

  // Filtrar e ordenar orçamentos
  const filteredBudgets = budgets
    .filter(budget => {
      const categoryMatch = selectedCategory === 'all' || budget.category === selectedCategory;
      const searchMatch = !searchTerm || 
        budget.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      return categoryMatch && searchMatch;
    })
    .map(budget => {
      // Calcular valores adicionais para cada orçamento
      const expensesInCategory = expenses.filter(expense => expense.category === budget.category);
      const totalExpense = expensesInCategory.reduce((sum, expense) => sum + expense.value, 0);
      const remaining = budget.value - totalExpense;
      const percentUsed = budget.value > 0 ? (totalExpense / budget.value) * 100 : 0;
      
      return {
        ...budget,
        totalExpense,
        remaining,
        percentUsed,
        status: percentUsed > 100 ? 'Excedido' : percentUsed >= 80 ? 'Atenção' : 'OK'
      };
    })
    .sort((a, b) => {
      // Ordenação
      if (sortBy === 'category') {
        return sortOrder === 'asc' 
          ? a.category.localeCompare(b.category)
          : b.category.localeCompare(a.category);
      } else if (sortBy === 'value') {
        return sortOrder === 'asc' 
          ? a.value - b.value
          : b.value - a.value;
      } else if (sortBy === 'remaining') {
        return sortOrder === 'asc' 
          ? a.remaining - b.remaining
          : b.remaining - a.remaining;
      } else if (sortBy === 'percentUsed') {
        return sortOrder === 'asc' 
          ? a.percentUsed - b.percentUsed
          : b.percentUsed - a.percentUsed;
      }
      return 0;
    });

  // Paginação
  const totalPages = Math.ceil(filteredBudgets.length / itemsPerPage);
  const paginatedBudgets = filteredBudgets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Alternar ordem de classificação
  const toggleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // Renderizar seta de ordenação
  const renderSortArrow = (column: string) => {
    if (sortBy !== column) return null;
    
    return sortOrder === 'asc' ? (
      <span className="ml-1">↑</span>
    ) : (
      <span className="ml-1">↓</span>
    );
  };

  if (isLoading) {
    return <div className="animate-pulse">Carregando orçamentos...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold">Lista de Orçamentos</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Input
            placeholder="Buscar por categoria..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64"
            size="sm"
          />
          <Select
            options={[
              { value: 'all', label: 'Todas as Categorias' },
              ...categories.map(category => ({ value: category, label: category }))
            ]}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-48"
            size="sm"
          />
        </div>
      </CardHeader>
      <CardContent>
        {paginatedBudgets.length > 0 ? (
          <>
            <Table hoverable striped>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer" 
                    onClick={() => toggleSort('category')}
                  >
                    Categoria {renderSortArrow('category')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer" 
                    onClick={() => toggleSort('value')}
                  >
                    Valor Orçado {renderSortArrow('value')}
                  </TableHead>
                  <TableHead>Valor Gasto</TableHead>
                  <TableHead 
                    className="cursor-pointer" 
                    onClick={() => toggleSort('remaining')}
                  >
                    Restante {renderSortArrow('remaining')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer" 
                    onClick={() => toggleSort('percentUsed')}
                  >
                    Utilização {renderSortArrow('percentUsed')}
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedBudgets.map((budget) => (
                  <TableRow key={budget.id}>
                    <TableCell>{budget.category}</TableCell>
                    <TableCell>R$ {budget.value.toFixed(2)}</TableCell>
                    <TableCell>R$ {budget.totalExpense.toFixed(2)}</TableCell>
                    <TableCell className={budget.remaining < 0 ? 'text-red-600 dark:text-red-400' : ''}>
                      R$ {budget.remaining.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                          <div 
                            className={`h-2.5 rounded-full ${
                              budget.percentUsed > 100 
                                ? 'bg-red-600' 
                                : budget.percentUsed >= 80 
                                  ? 'bg-yellow-500' 
                                  : 'bg-green-600'
                            }`} 
                            style={{ width: `${Math.min(budget.percentUsed, 100)}%` }}
                          ></div>
                        </div>
                        <span>{budget.percentUsed.toFixed(1)}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        budget.status === 'Excedido' 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' 
                          : budget.status === 'Atenção' 
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' 
                            : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      }`}>
                        {budget.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="xs" 
                          onClick={() => onViewDetail(budget)}
                        >
                          Ver
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="xs" 
                          onClick={() => onEdit(budget)}
                        >
                          Editar
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="xs" 
                          onClick={() => onDelete(budget.id)}
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
              Nenhum orçamento encontrado com os filtros atuais.
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
            >
              Limpar Filtros
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BudgetList;