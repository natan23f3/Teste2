import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '../UI/Card';
import { Button } from '../UI/Button';
import { Chart } from '../UI/Chart';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../UI/Table';
import { Budget } from '../../services/budgetService';
import { Expense } from '../../services/expenseService';

interface BudgetDetailProps {
  budget: Budget;
  expenses: Expense[];
  onEdit: (budget: Budget) => void;
  onClose: () => void;
}

const BudgetDetail: React.FC<BudgetDetailProps> = ({
  budget,
  expenses,
  onEdit,
  onClose
}) => {
  // Filtrar despesas relacionadas a esta categoria de orçamento
  const relatedExpenses = expenses.filter(expense => expense.category === budget.category);
  
  // Calcular valores
  const totalExpense = relatedExpenses.reduce((sum, expense) => sum + expense.value, 0);
  const remaining = budget.value - totalExpense;
  const percentUsed = budget.value > 0 ? (totalExpense / budget.value) * 100 : 0;
  const status = percentUsed > 100 ? 'Excedido' : percentUsed >= 80 ? 'Atenção' : 'OK';

  // Preparar dados para o gráfico de comparação
  const comparisonData = [
    { name: 'Orçado vs. Realizado', orçado: budget.value, realizado: totalExpense }
  ];

  // Preparar dados para o gráfico de pizza
  const pieData = [
    { name: 'Gasto', value: totalExpense },
    { name: 'Restante', value: remaining > 0 ? remaining : 0 }
  ];

  // Agrupar despesas por data (simulado para demonstração)
  const expensesByMonth: Record<string, number> = {};
  
  // Inicializar os últimos 6 meses
  const today = new Date();
  for (let i = 5; i >= 0; i--) {
    const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthKey = month.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
    expensesByMonth[monthKey] = 0;
  }
  
  // Preencher com dados reais
  relatedExpenses.forEach(expense => {
    const expenseDate = new Date(expense.date);
    const monthKey = expenseDate.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
    
    if (expensesByMonth[monthKey] !== undefined) {
      expensesByMonth[monthKey] += expense.value;
    }
  });
  
  // Converter para formato de array para o gráfico
  const trendData = Object.entries(expensesByMonth).map(([month, value]) => ({
    month,
    valor: value
  }));

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Detalhes do Orçamento</h2>
          <p className="text-gray-600 dark:text-gray-400">Categoria: {budget.category}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          status === 'Excedido' 
            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' 
            : status === 'Atenção' 
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' 
              : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
        }`}>
          {status}
        </span>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Resumo do Orçamento */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Valor Orçado</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              R$ {budget.value.toFixed(2)}
            </p>
          </div>
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Valor Gasto</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              R$ {totalExpense.toFixed(2)}
            </p>
          </div>
          <div className={`p-4 ${remaining >= 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'} rounded-lg text-center`}>
            <p className="text-sm text-gray-600 dark:text-gray-400">Saldo</p>
            <p className={`text-2xl font-bold ${remaining >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              R$ {remaining.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Barra de Progresso */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-600 dark:text-gray-400">Utilização do Orçamento</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">{percentUsed.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${
                percentUsed > 100 
                  ? 'bg-red-600' 
                  : percentUsed >= 80 
                    ? 'bg-yellow-500' 
                    : 'bg-green-600'
              }`} 
              style={{ width: `${Math.min(percentUsed, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gráfico de Comparação */}
          <div>
            <h3 className="text-lg font-medium mb-4">Orçado vs. Realizado</h3>
            <Chart
              data={comparisonData}
              type="bar"
              series={[
                { dataKey: 'orçado', name: 'Orçado' },
                { dataKey: 'realizado', name: 'Realizado' }
              ]}
              xAxisDataKey="name"
              size="lg"
            />
          </div>

          {/* Gráfico de Pizza */}
          <div>
            <h3 className="text-lg font-medium mb-4">Distribuição</h3>
            <Chart
              data={pieData}
              type="pie"
              series={[{ dataKey: 'value' }]}
              xAxisDataKey="name"
              size="lg"
            />
          </div>
        </div>

        {/* Gráfico de Tendência */}
        <div>
          <h3 className="text-lg font-medium mb-4">Tendência de Gastos (Últimos 6 meses)</h3>
          <Chart
            data={trendData}
            type="line"
            series={[{ dataKey: 'valor', name: 'Valor Gasto' }]}
            xAxisDataKey="month"
            size="lg"
          />
        </div>

        {/* Tabela de Despesas Relacionadas */}
        <div>
          <h3 className="text-lg font-medium mb-4">Despesas Relacionadas</h3>
          {relatedExpenses.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>% do Orçamento</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {relatedExpenses.map((expense, index) => {
                  const percentOfBudget = budget.value > 0 
                    ? ((expense.value / budget.value) * 100).toFixed(1) 
                    : '0';
                  
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        {new Date(expense.date).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>R$ {expense.value.toFixed(2)}</TableCell>
                      <TableCell>{percentOfBudget}%</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-gray-500 py-4">
              Nenhuma despesa registrada para esta categoria.
            </p>
          )}
        </div>

        {/* Recomendações */}
        {percentUsed > 80 && (
          <div className={`p-4 rounded-lg ${
            percentUsed > 100 
              ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' 
              : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
          }`}>
            <h3 className="text-lg font-medium mb-2">Recomendações</h3>
            <ul className="list-disc pl-5 space-y-1">
              {percentUsed > 100 ? (
                <>
                  <li>Este orçamento foi excedido. Considere revisar seus gastos nesta categoria.</li>
                  <li>Avalie a possibilidade de aumentar o valor orçado para o próximo período.</li>
                  <li>Identifique despesas que podem ser reduzidas ou eliminadas.</li>
                </>
              ) : (
                <>
                  <li>Este orçamento está próximo do limite. Monitore cuidadosamente os gastos adicionais.</li>
                  <li>Priorize despesas essenciais para o restante do período.</li>
                  <li>Considere ajustar o valor orçado se este padrão for recorrente.</li>
                </>
              )}
            </ul>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>
          Fechar
        </Button>
        <Button onClick={() => onEdit(budget)}>
          Editar Orçamento
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BudgetDetail;