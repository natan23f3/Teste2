import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '../UI/Card';
import { Button } from '../UI/Button';
import { Chart } from '../UI/Chart';
import { Expense } from '../../services/expenseService';
import { Budget } from '../../services/budgetService';

// Estendendo a interface Expense para incluir descrição opcional
interface ExtendedExpense extends Expense {
  description?: string;
}

interface ExpenseDetailProps {
  expense: ExtendedExpense;
  budgets: Budget[];
  relatedExpenses: Expense[];
  onEdit: (expense: ExtendedExpense) => void;
  onClose: () => void;
}

const ExpenseDetail: React.FC<ExpenseDetailProps> = ({
  expense,
  budgets,
  relatedExpenses,
  onEdit,
  onClose
}) => {
  // Encontrar o orçamento relacionado a esta categoria
  const relatedBudget = budgets.find(budget => budget.category === expense.category);
  
  // Calcular valores
  const budgetValue = relatedBudget?.value || 0;
  const totalExpensesInCategory = relatedExpenses.reduce((sum, exp) => sum + exp.value, 0);
  const percentOfBudget = budgetValue > 0 ? (expense.value / budgetValue) * 100 : 0;
  const percentOfCategoryExpenses = totalExpensesInCategory > 0 
    ? (expense.value / totalExpensesInCategory) * 100 
    : 0;
  
  // Formatar data
  const formattedDate = new Date(expense.date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  // Dados para o gráfico de comparação com orçamento
  const budgetComparisonData = [
    {
      name: 'Comparação com Orçamento',
      despesa: expense.value,
      orçado: budgetValue
    }
  ];

  // Dados para o gráfico de pizza de distribuição de despesas na categoria
  const categoryDistributionData = [
    { name: 'Esta Despesa', value: expense.value },
    { name: 'Outras Despesas', value: totalExpensesInCategory - expense.value }
  ];

  // Dados para o gráfico de linha de tendência (simulado)
  const trendData = [
    { month: 'Jan', valor: 1200 },
    { month: 'Fev', valor: 1900 },
    { month: 'Mar', valor: 1500 },
    { month: 'Abr', valor: 1800 },
    { month: 'Mai', valor: 1200 },
    { month: 'Jun', valor: 2100 }
  ];

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Detalhes da Despesa</h2>
          <p className="text-gray-600 dark:text-gray-400">Categoria: {expense.category}</p>
        </div>
        <span className="px-3 py-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-full text-sm font-medium">
          R$ {expense.value.toFixed(2)}
        </span>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Informações Básicas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Data</p>
            <p className="text-lg font-medium">{formattedDate}</p>
          </div>
          
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Valor</p>
            <p className="text-lg font-medium text-red-600 dark:text-red-400">
              R$ {expense.value.toFixed(2)}
            </p>
          </div>
          
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Categoria</p>
            <p className="text-lg font-medium">{expense.category}</p>
          </div>
        </div>
        
        {/* Descrição (se houver) */}
        {expense.description && (
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Descrição</p>
            <p>{expense.description}</p>
          </div>
        )}
        
        {/* Comparação com Orçamento */}
        {relatedBudget && (
          <div>
            <h3 className="text-lg font-medium mb-2">Comparação com Orçamento</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Chart
                  data={budgetComparisonData}
                  type="bar"
                  series={[
                    { dataKey: 'despesa', name: 'Esta Despesa' },
                    { dataKey: 'orçado', name: 'Valor Orçado' }
                  ]}
                  xAxisDataKey="name"
                  size="lg"
                />
              </div>
              
              <div className="flex flex-col justify-center">
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Porcentagem do Orçamento
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {percentOfBudget.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        percentOfBudget > 50 
                          ? 'bg-red-600' 
                          : percentOfBudget > 25 
                            ? 'bg-yellow-500' 
                            : 'bg-green-600'
                      }`} 
                      style={{ width: `${Math.min(percentOfBudget, 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Orçamento da Categoria: <span className="font-medium">R$ {budgetValue.toFixed(2)}</span>
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total Gasto na Categoria: <span className="font-medium">R$ {totalExpensesInCategory.toFixed(2)}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Distribuição na Categoria */}
        {totalExpensesInCategory > expense.value && (
          <div>
            <h3 className="text-lg font-medium mb-2">Distribuição na Categoria</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Chart
                  data={categoryDistributionData}
                  type="pie"
                  series={[{ dataKey: 'value' }]}
                  xAxisDataKey="name"
                  size="lg"
                />
              </div>
              
              <div className="flex flex-col justify-center">
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Porcentagem do Total da Categoria
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {percentOfCategoryExpenses.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="h-2.5 rounded-full bg-blue-600" 
                      style={{ width: `${percentOfCategoryExpenses}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Esta despesa representa <span className="font-medium">{percentOfCategoryExpenses.toFixed(1)}%</span> do 
                    total gasto na categoria {expense.category}.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Tendência de Gastos */}
        <div>
          <h3 className="text-lg font-medium mb-2">Tendência de Gastos na Categoria</h3>
          <Chart
            data={trendData}
            type="line"
            series={[{ dataKey: 'valor', name: 'Valor Gasto' }]}
            xAxisDataKey="month"
            size="lg"
          />
          <p className="text-sm text-gray-500 text-center mt-2">
            Nota: Este gráfico mostra uma tendência simulada para fins de demonstração.
          </p>
        </div>
        
        {/* Recomendações */}
        {relatedBudget && percentOfBudget > 25 && (
          <div className={`p-4 rounded-lg ${
            percentOfBudget > 50 
              ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' 
              : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
          }`}>
            <h3 className="text-lg font-medium mb-2">Análise de Impacto</h3>
            <ul className="list-disc pl-5 space-y-1">
              {percentOfBudget > 50 ? (
                <>
                  <li>Esta despesa representa uma parte significativa do orçamento da categoria.</li>
                  <li>Considere revisar o valor orçado ou reduzir gastos futuros nesta categoria.</li>
                </>
              ) : (
                <>
                  <li>Esta despesa representa uma parte moderada do orçamento da categoria.</li>
                  <li>Monitore gastos adicionais nesta categoria para evitar exceder o orçamento.</li>
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
        <Button onClick={() => onEdit(expense)}>
          Editar Despesa
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ExpenseDetail;