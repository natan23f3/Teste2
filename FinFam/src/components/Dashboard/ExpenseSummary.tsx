import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../UI/Card';
import { Chart } from '../UI/Chart';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../UI/Table';
import { Button } from '../UI/Button';
import { Select } from '../UI/Select';
import { Input } from '../UI/Input';
import { Expense } from '../../services/expenseService';

interface ExpenseSummaryProps {
  expenses: Expense[];
  isLoading: boolean;
}

const ExpenseSummary: React.FC<ExpenseSummaryProps> = ({ expenses, isLoading }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Obter categorias únicas
  const categoriesSet = new Set<string>();
  expenses.forEach(expense => categoriesSet.add(expense.category));
  const categories = Array.from(categoriesSet);

  // Filtrar despesas
  const filteredExpenses = expenses.filter(expense => {
    // Filtro por categoria
    const categoryMatch = selectedCategory === 'all' || expense.category === selectedCategory;
    
    // Filtro por termo de busca
    const searchMatch = !searchTerm || 
      expense.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtro por período (simplificado para demonstração)
    let periodMatch = true;
    if (selectedPeriod !== 'all') {
      const expenseDate = new Date(expense.date);
      const now = new Date();
      
      if (selectedPeriod === 'month') {
        periodMatch = expenseDate.getMonth() === now.getMonth() && 
                      expenseDate.getFullYear() === now.getFullYear();
      } else if (selectedPeriod === 'quarter') {
        const expenseQuarter = Math.floor(expenseDate.getMonth() / 3);
        const currentQuarter = Math.floor(now.getMonth() / 3);
        periodMatch = expenseQuarter === currentQuarter && 
                      expenseDate.getFullYear() === now.getFullYear();
      } else if (selectedPeriod === 'year') {
        periodMatch = expenseDate.getFullYear() === now.getFullYear();
      }
    }
    
    return categoryMatch && searchMatch && periodMatch;
  });

  // Agrupar despesas por categoria
  const expensesByCategory = filteredExpenses.reduce((acc, expense) => {
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

  // Calcular total de despesas
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.value, 0);

  // Preparar dados para o gráfico de linha (simulado para demonstração)
  const lineChartData = [
    { month: 'Jan', valor: 1200 },
    { month: 'Fev', valor: 1900 },
    { month: 'Mar', valor: 1500 },
    { month: 'Abr', valor: 1800 },
    { month: 'Mai', valor: 1200 },
    { month: 'Jun', valor: 2100 },
    { month: 'Jul', valor: 1700 },
    { month: 'Ago', valor: 1400 },
    { month: 'Set', valor: 1600 },
    { month: 'Out', valor: 1800 },
    { month: 'Nov', valor: 2200 },
    { month: 'Dez', valor: 2500 }
  ];

  if (isLoading) {
    return <div className="animate-pulse">Carregando dados de despesas...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Filtros</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Buscar"
              placeholder="Buscar por categoria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              label="Categoria"
              options={[
                { value: 'all', label: 'Todas as Categorias' },
                ...categories.map(category => ({ value: category, label: category }))
              ]}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            />
            <Select
              label="Período"
              options={[
                { value: 'all', label: 'Todo o Período' },
                { value: 'month', label: 'Este Mês' },
                { value: 'quarter', label: 'Este Trimestre' },
                { value: 'year', label: 'Este Ano' }
              ]}
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Resumo de Despesas */}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Resumo de Despesas</h3>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gráfico de Pizza */}
            <div>
              <h4 className="text-md font-medium mb-4 text-center">Distribuição por Categoria</h4>
              {pieChartData.length > 0 ? (
                <Chart
                  data={pieChartData}
                  type="pie"
                  series={[{ dataKey: 'value' }]}
                  xAxisDataKey="name"
                  size="lg"
                />
              ) : (
                <p className="text-center text-gray-500 py-8">Nenhuma despesa encontrada</p>
              )}
            </div>

            {/* Gráfico de Linha */}
            <div>
              <h4 className="text-md font-medium mb-4 text-center">Tendência de Despesas</h4>
              <Chart
                data={lineChartData}
                type="line"
                series={[{ dataKey: 'valor', name: 'Despesas' }]}
                xAxisDataKey="month"
                xAxisLabel="Mês"
                yAxisLabel="Valor (R$)"
                size="lg"
              />
            </div>
          </div>

          {/* Resumo de Valores */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total de Despesas</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                R$ {totalExpenses.toFixed(2)}
              </p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Média Mensal</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                R$ {(totalExpenses / 12).toFixed(2)}
              </p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Maior Categoria</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {pieChartData.length > 0 
                  ? pieChartData.sort((a, b) => b.value - a.value)[0].name
                  : 'N/A'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Despesas */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Detalhes das Despesas</h3>
        </CardHeader>
        <CardContent>
          {filteredExpenses.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>% do Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.map((expense, index) => {
                  const percentOfTotal = totalExpenses > 0 
                    ? ((expense.value / totalExpenses) * 100).toFixed(1) 
                    : '0';
                  
                  return (
                    <TableRow key={index}>
                      <TableCell>{expense.category}</TableCell>
                      <TableCell>R$ {expense.value.toFixed(2)}</TableCell>
                      <TableCell>
                        {new Date(expense.date).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>{percentOfTotal}%</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-gray-500 py-8">Nenhuma despesa encontrada</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseSummary;