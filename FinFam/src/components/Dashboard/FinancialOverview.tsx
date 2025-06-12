import React from 'react';
import { Card, CardHeader, CardContent } from '../UI/Card';
import { Chart } from '../UI/Chart';
import { Budget } from '../../services/budgetService';
import { Expense } from '../../services/expenseService';

interface FinancialOverviewProps {
  budgets: Budget[];
  expenses: Expense[];
  isLoading: boolean;
}

const FinancialOverview: React.FC<FinancialOverviewProps> = ({ budgets, expenses, isLoading }) => {
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
  const comparisonData = Object.keys({ ...budgetsByCategory, ...expensesByCategory }).map(category => ({
    category,
    orçado: budgetsByCategory[category] || 0,
    realizado: expensesByCategory[category] || 0,
    diferença: (budgetsByCategory[category] || 0) - (expensesByCategory[category] || 0)
  }));

  // Preparar dados para o gráfico de pizza de despesas
  const expensePieData = Object.entries(expensesByCategory).map(([category, value]) => ({
    name: category,
    value
  }));

  // Calcular totais
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.value, 0);
  const totalExpense = expenses.reduce((sum, expense) => sum + expense.value, 0);
  const balance = totalBudget - totalExpense;
  const percentUsed = totalBudget > 0 ? (totalExpense / totalBudget) * 100 : 0;

  if (isLoading) {
    return <div className="animate-pulse">Carregando dados financeiros...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Comparação Orçado vs. Realizado */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Orçado vs. Realizado por Categoria</h3>
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

        {/* Gráfico de Pizza de Despesas */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Distribuição de Despesas</h3>
          </CardHeader>
          <CardContent>
            {expensePieData.length > 0 ? (
              <Chart
                data={expensePieData}
                type="pie"
                series={[{ dataKey: 'value' }]}
                xAxisDataKey="name"
                size="lg"
              />
            ) : (
              <p className="text-center text-gray-500 py-8">Nenhuma despesa registrada</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Resumo Financeiro */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Resumo Financeiro</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Orçado</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                R$ {totalBudget.toFixed(2)}
              </p>
            </div>
            <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Gasto</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                R$ {totalExpense.toFixed(2)}
              </p>
            </div>
            <div className={`text-center p-4 ${balance >= 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'} rounded-lg`}>
              <p className="text-sm text-gray-600 dark:text-gray-400">Saldo</p>
              <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                R$ {balance.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Barra de Progresso */}
          <div className="mt-6">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600 dark:text-gray-400">Utilização do Orçamento</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{percentUsed.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${percentUsed > 100 ? 'bg-red-600' : 'bg-blue-600'}`} 
                style={{ width: `${Math.min(percentUsed, 100)}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tendências */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Tendências de Gastos</h3>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-4">
            Dados históricos insuficientes para análise de tendências.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialOverview;