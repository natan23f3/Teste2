import React, { useState } from 'react';
import { useFamily } from '../../../hooks/useFamily';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardDescription 
} from '../../UI/Card';
import { Chart } from '../../UI/Chart';
import { Select } from '../../UI/Select';
import { DatePicker } from '../../UI/DatePicker';
import { Button } from '../../UI/Button';
import MemberActivity from './MemberActivity';
import BudgetCompliance from './BudgetCompliance';
import ExpenseTracking from './ExpenseTracking';

interface ActivityDashboardProps {
  onViewMemberDetails: (memberId: number) => void;
}

const ActivityDashboard: React.FC<ActivityDashboardProps> = ({
  onViewMemberDetails
}) => {
  const { selectedFamily } = useFamily();
  const [dateRange, setDateRange] = useState<{
    startDate: Date;
    endDate: Date;
  }>({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    endDate: new Date()
  });
  
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'budget' | 'expenses'>('overview');

  // Opções para o filtro de período
  const periodOptions = [
    { value: '7days', label: 'Últimos 7 dias' },
    { value: '30days', label: 'Últimos 30 dias' },
    { value: '90days', label: 'Últimos 90 dias' },
    { value: 'custom', label: 'Personalizado' }
  ];

  // Handler para mudança de período
  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const today = new Date();
    
    switch (value) {
      case '7days':
        setDateRange({
          startDate: new Date(today.setDate(today.getDate() - 7)),
          endDate: new Date()
        });
        break;
      case '30days':
        setDateRange({
          startDate: new Date(today.setDate(today.getDate() - 30)),
          endDate: new Date()
        });
        break;
      case '90days':
        setDateRange({
          startDate: new Date(today.setDate(today.getDate() - 90)),
          endDate: new Date()
        });
        break;
      // Para 'custom', não fazemos nada aqui, pois o usuário selecionará as datas manualmente
    }
  };

  // Dados de exemplo para o gráfico de atividades
  const activityData = [
    { date: '2025-05-15', expenses: 5, budgets: 1, members: 0 },
    { date: '2025-05-16', expenses: 3, budgets: 0, members: 1 },
    { date: '2025-05-17', expenses: 7, budgets: 0, members: 0 },
    { date: '2025-05-18', expenses: 2, budgets: 0, members: 0 },
    { date: '2025-05-19', expenses: 4, budgets: 1, members: 2 },
    { date: '2025-05-20', expenses: 6, budgets: 0, members: 0 },
    { date: '2025-05-21', expenses: 8, budgets: 2, members: 1 },
    { date: '2025-05-22', expenses: 5, budgets: 0, members: 0 },
    { date: '2025-05-23', expenses: 3, budgets: 0, members: 0 },
    { date: '2025-05-24', expenses: 4, budgets: 1, members: 0 },
    { date: '2025-05-25', expenses: 7, budgets: 0, members: 1 },
    { date: '2025-05-26', expenses: 9, budgets: 0, members: 0 },
    { date: '2025-05-27', expenses: 6, budgets: 1, members: 0 },
    { date: '2025-05-28', expenses: 4, budgets: 0, members: 2 }
  ];

  // Renderizar a tab ativa
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'members':
        return <MemberActivity onViewMemberDetails={onViewMemberDetails} />;
      case 'budget':
        return <BudgetCompliance />;
      case 'expenses':
        return <ExpenseTracking />;
      default:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Atividades Recentes</CardTitle>
                <CardDescription>
                  Visão geral das atividades da família
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Chart
                  type="bar"
                  data={activityData}
                  xAxisDataKey="date"
                  xAxisLabel="Data"
                  yAxisLabel="Quantidade"
                  series={[
                    { dataKey: 'expenses', name: 'Despesas', color: '#3b82f6' },
                    { dataKey: 'budgets', name: 'Orçamentos', color: '#10b981' },
                    { dataKey: 'members', name: 'Membros', color: '#f59e0b' }
                  ]}
                  size="lg"
                />
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Atividade de Membros</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600">8</div>
                    <div className="text-sm text-gray-500">Ações nos últimos 7 dias</div>
                  </div>
                  <Button 
                    variant="link" 
                    className="w-full mt-4"
                    onClick={() => setActiveTab('members')}
                  >
                    Ver detalhes
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Conformidade com Orçamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600">85%</div>
                    <div className="text-sm text-gray-500">Dentro do orçamento</div>
                  </div>
                  <Button 
                    variant="link" 
                    className="w-full mt-4"
                    onClick={() => setActiveTab('budget')}
                  >
                    Ver detalhes
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Rastreamento de Despesas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-amber-600">42</div>
                    <div className="text-sm text-gray-500">Despesas registradas</div>
                  </div>
                  <Button 
                    variant="link" 
                    className="w-full mt-4"
                    onClick={() => setActiveTab('expenses')}
                  >
                    Ver detalhes
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold">
          Dashboard de Atividades {selectedFamily?.name ? `- ${selectedFamily.name}` : ''}
        </h2>
        
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <div className="w-full md:w-48">
            <Select
              options={periodOptions}
              value="30days"
              onChange={handlePeriodChange}
              label="Período"
            />
          </div>
          
          <div className="flex gap-2">
            <DatePicker
              selected={dateRange.startDate}
              onChange={(date) => date && setDateRange(prev => ({ ...prev, startDate: date }))}
              placeholderText="Data inicial"
              className="w-full"
            />
            <DatePicker
              selected={dateRange.endDate}
              onChange={(date) => date && setDateRange(prev => ({ ...prev, endDate: date }))}
              placeholderText="Data final"
              className="w-full"
            />
          </div>
        </div>
      </div>
      
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'overview'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('overview')}
        >
          Visão Geral
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'members'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('members')}
        >
          Atividade de Membros
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'budget'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('budget')}
        >
          Conformidade com Orçamento
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'expenses'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('expenses')}
        >
          Rastreamento de Despesas
        </button>
      </div>
      
      <div className="py-4">
        {renderActiveTab()}
      </div>
    </div>
  );
};

export default ActivityDashboard;