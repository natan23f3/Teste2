import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Tabs, TabList, TabButton, TabPanel, TabPanels } from '../../components/UI/Tabs';
import { useFamily } from '../../hooks/useFamily';
import { useBudget } from '../../hooks/useBudget';
import { useExpense } from '../../hooks/useExpense';

// Importações dos componentes que serão criados
// Estes serão implementados em seguida
import BudgetSummary from './BudgetSummary';
import ExpenseSummary from './ExpenseSummary';
import FinancialOverview from './FinancialOverview';
import GoalProgress from './GoalProgress';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { selectedFamily } = useFamily();
  const { budgets, isLoadingBudgets } = useBudget();
  const { expenses, isLoadingExpenses } = useExpense();

  if (!selectedFamily) {
    return (
      <Card className="text-center p-8">
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">Nenhuma família selecionada</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Selecione uma família para visualizar o dashboard financeiro.
          </p>
        </CardContent>
      </Card>
    );
  }

  const isLoading = isLoadingBudgets || isLoadingExpenses;

  const handleTabChange = (id: string) => {
    setActiveTab(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard Financeiro</h1>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            Exportar PDF
          </Button>
          <Button variant="outline" size="sm">
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <h3 className="text-sm font-medium">Total Orçado</h3>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {isLoading ? (
                <span className="animate-pulse">Carregando...</span>
              ) : (
                `R$ ${budgets.reduce((sum, budget) => sum + budget.value, 0).toFixed(2)}`
              )}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <h3 className="text-sm font-medium">Total Gasto</h3>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {isLoading ? (
                <span className="animate-pulse">Carregando...</span>
              ) : (
                `R$ ${expenses.reduce((sum, expense) => sum + expense.value, 0).toFixed(2)}`
              )}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <h3 className="text-sm font-medium">Saldo</h3>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {isLoading ? (
                <span className="animate-pulse">Carregando...</span>
              ) : (
                `R$ ${(
                  budgets.reduce((sum, budget) => sum + budget.value, 0) -
                  expenses.reduce((sum, expense) => sum + expense.value, 0)
                ).toFixed(2)}`
              )}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <h3 className="text-sm font-medium">Progresso de Metas</h3>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {isLoading ? (
                <span className="animate-pulse">Carregando...</span>
              ) : (
                '50%'
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de conteúdo */}
      <Card>
        <CardHeader>
          <Tabs defaultTab={activeTab} onChange={handleTabChange}>
            <TabList>
              <TabButton id="overview">Visão Geral</TabButton>
              <TabButton id="budgets">Orçamentos</TabButton>
              <TabButton id="expenses">Despesas</TabButton>
              <TabButton id="goals">Metas</TabButton>
            </TabList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <TabPanels>
            <TabPanel id="overview">
              <FinancialOverview budgets={budgets} expenses={expenses} isLoading={isLoading} />
            </TabPanel>
            <TabPanel id="budgets">
              <BudgetSummary budgets={budgets} expenses={expenses} isLoading={isLoading} />
            </TabPanel>
            <TabPanel id="expenses">
              <ExpenseSummary expenses={expenses} isLoading={isLoading} />
            </TabPanel>
            <TabPanel id="goals">
              <GoalProgress isLoading={isLoading} />
            </TabPanel>
          </TabPanels>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;