import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../UI/Card';
import { Chart } from '../UI/Chart';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../UI/Table';
import { Button } from '../UI/Button';
import { Select } from '../UI/Select';
import { Budget } from '../../services/budgetService';
import { Expense } from '../../services/expenseService';

interface BudgetSummaryProps {
  budgets: Budget[];
  expenses: Expense[];
  isLoading: boolean;
}

const BudgetSummary: React.FC<BudgetSummaryProps> = ({ budgets, expenses, isLoading }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Obter categorias únicas
  const categoriesSet = new Set<string>();
  budgets.forEach(budget => categoriesSet.add(budget.category));
  const categories = Array.from(categoriesSet);

  // Filtrar orçamentos por categoria selecionada
  const filteredBudgets = selectedCategory === 'all' 
    ? budgets 
    : budgets.filter(budget => budget.category === selectedCategory);

  // Agrupar orçamentos por categoria
  const budgetsByCategory = budgets.reduce((acc, budget) => {
    const category = budget.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += budget.value;
    return acc;
  }, {} as Record<string, number>);

  // Agrupar despesas por categoria
  const expensesByCategory = expenses.reduce((acc, expense) => {
    const category = expense.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += expense.value;
    return acc;
  }, {} as Record<string, number>);

  // Preparar dados para o gráfico de comparação orçado vs. realizado
  const comparisonData = Object.keys(budgetsByCategory).map(category => ({
    category,
    orçado: budgetsByCategory[category] || 0,
    realizado: expensesByCategory[category] || 0,
    diferença: (budgetsByCategory[category] || 0) - (expensesByCategory[category] || 0),
    percentual: expensesByCategory[category] 
      ? ((expensesByCategory[category] / budgetsByCategory[category]) * 100).toFixed(1) + '%'
      : '0%'
  }));

  // Preparar dados para a tabela de orçamentos
  const budgetTableData = filteredBudgets.map(budget => {
    const expensesInCategory = expenses.filter(expense => expense.category === budget.category);
    const totalExpense = expensesInCategory.reduce((sum, expense) => sum + expense.value, 0);
    const remaining = budget.value - totalExpense;
    const percentUsed = budget.value > 0 ? (totalExpense / budget.value) * 100 : 0;
    
    return {
      ...budget,
      totalExpense,
      remaining,
      percentUsed: percentUsed.toFixed(1) + '%',
      status: percentUsed > 100 ? 'Excedido' : percentUsed >= 80 ? 'Atenção' : 'OK'
    };
  });

  if (isLoading) {
    return <div className="animate-pulse">Carregando dados de orçamentos...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Gráfico de Comparação Orçado vs. Realizado */}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Orçado vs. Realizado por Categoria</h3>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              Exportar PDF
            </Button>
            <Button variant="outline" size="sm">
              Exportar CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {comparisonData.length > 0 ? (
            <Chart
              data={comparisonData}
              type="bar"
              series={[
                { dataKey: 'orçado', name: 'Orçado' },
                { dataKey: 'realizado', name: 'Realizado' }
              ]}
              xAxisDataKey="category"
              xAxisLabel="Categoria"
              yAxisLabel="Valor (R$)"
              size="lg"
            />
          ) : (
            <p className="text-center text-gray-500 py-8">Nenhum dado disponível</p>
          )}
        </CardContent>
      </Card>

      {/* Tabela de Orçamentos */}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Detalhes dos Orçamentos</h3>
          <div className="flex items-center space-x-2">
            <Select
              options={[
                { value: 'all', label: 'Todas as Categorias' },
                ...categories.map(category => ({ value: category, label: category }))
              ]}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              size="sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          {budgetTableData.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Valor Orçado</TableHead>
                  <TableHead>Valor Gasto</TableHead>
                  <TableHead>Restante</TableHead>
                  <TableHead>Utilização</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {budgetTableData.map((budget, index) => (
                  <TableRow key={index}>
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
                              parseFloat(budget.percentUsed) > 100 
                                ? 'bg-red-600' 
                                : parseFloat(budget.percentUsed) >= 80 
                                  ? 'bg-yellow-500' 
                                  : 'bg-green-600'
                            }`} 
                            style={{ width: `${Math.min(parseFloat(budget.percentUsed), 100)}%` }}
                          ></div>
                        </div>
                        <span>{budget.percentUsed}</span>
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-gray-500 py-8">Nenhum orçamento encontrado</p>
          )}
        </CardContent>
      </Card>

      {/* Resumo de Utilização */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Resumo de Utilização do Orçamento</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {comparisonData.map((item, index) => (
              <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-medium mb-2">{item.category}</h4>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Orçado: R$ {item.orçado.toFixed(2)}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Utilizado: {item.percentual}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${
                      parseFloat(item.percentual) > 100 
                        ? 'bg-red-600' 
                        : parseFloat(item.percentual) >= 80 
                          ? 'bg-yellow-500' 
                          : 'bg-green-600'
                    }`} 
                    style={{ width: `${Math.min(parseFloat(item.percentual), 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetSummary;