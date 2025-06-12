import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { Modal } from '../components/UI/Modal';
import { Chart } from '../components/UI/Chart';
import GoalForm, { Goal } from '../components/Goals/GoalForm';
import GoalList from '../components/Goals/GoalList';
import GoalDetail from '../components/Goals/GoalDetail';

const GoalsPage: React.FC = () => {
  // Estado para armazenar as metas (simulado, em um caso real seria um hook como useMetas)
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: 1,
      name: 'Fundo de Emergência',
      target: 10000,
      current: 6500,
      deadline: '2025-12-31',
      category: 'Poupança',
      priority: 'Alta',
      description: 'Acumular 6 meses de despesas para emergências'
    },
    {
      id: 2,
      name: 'Viagem de Férias',
      target: 5000,
      current: 2800,
      deadline: '2026-07-15',
      category: 'Lazer',
      priority: 'Média',
      description: 'Viagem para a praia com a família'
    },
    {
      id: 3,
      name: 'Novo Carro',
      target: 30000,
      current: 12000,
      deadline: '2027-01-01',
      category: 'Transporte',
      priority: 'Média'
    },
    {
      id: 4,
      name: 'Entrada Casa Própria',
      target: 50000,
      current: 15000,
      deadline: '2028-06-30',
      category: 'Moradia',
      priority: 'Alta',
      description: 'Entrada para financiamento de imóvel'
    },
    {
      id: 5,
      name: 'Educação dos Filhos',
      target: 20000,
      current: 8000,
      deadline: '2026-12-31',
      category: 'Educação',
      priority: 'Alta'
    }
  ]);
  
  // Estados para gerenciar a interface
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Calcular estatísticas
  const totalTargetAmount = goals.reduce((sum, goal) => sum + goal.target, 0);
  const totalCurrentAmount = goals.reduce((sum, goal) => sum + goal.current, 0);
  const totalRemainingAmount = totalTargetAmount - totalCurrentAmount;
  const overallProgress = totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0;

  // Agrupar metas por categoria
  const goalsByCategory = goals.reduce((acc, goal) => {
    const category = goal.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += goal.target;
    return acc;
  }, {} as Record<string, number>);

  // Preparar dados para o gráfico de pizza
  const pieChartData = Object.entries(goalsByCategory).map(([category, value]) => ({
    name: category,
    value
  }));

  // Preparar dados para o gráfico de progresso
  const progressChartData = goals.map(goal => ({
    name: goal.name,
    progresso: (goal.current / goal.target) * 100
  }));

  // Manipuladores de eventos
  const handleOpenForm = (goal?: Goal) => {
    setSelectedGoal(goal || null);
    setIsFormOpen(true);
  };

  const handleOpenDetail = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsDetailOpen(true);
  };

  const handleDeleteGoal = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta meta?')) {
      setIsLoading(true);
      // Simulando uma operação assíncrona
      setTimeout(() => {
        setGoals(goals.filter(goal => goal.id !== id));
        setIsLoading(false);
      }, 500);
    }
  };

  const handleFormSuccess = (goalData: Omit<Goal, 'id'>) => {
    setIsLoading(true);
    
    // Simulando uma operação assíncrona
    setTimeout(() => {
      if (selectedGoal) {
        // Atualizar meta existente
        setGoals(goals.map(goal => 
          goal.id === selectedGoal.id 
            ? { ...goal, ...goalData }
            : goal
        ));
      } else {
        // Criar nova meta
        const newGoal: Goal = {
          ...goalData,
          id: Math.max(0, ...goals.map(g => g.id)) + 1
        };
        setGoals([...goals, newGoal]);
      }
      
      setIsFormOpen(false);
      setSelectedGoal(null);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h1 className="text-2xl font-bold">Metas Financeiras</h1>
        <Button 
          onClick={() => handleOpenForm()}
        >
          Nova Meta
        </Button>
      </div>

      {/* Resumo de Metas */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Resumo de Metas</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Valor Total das Metas</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                R$ {totalTargetAmount.toFixed(2)}
              </p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Valor Acumulado</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                R$ {totalCurrentAmount.toFixed(2)}
              </p>
            </div>
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Valor Restante</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                R$ {totalRemainingAmount.toFixed(2)}
              </p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Progresso Geral</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {overallProgress.toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Barra de Progresso Geral */}
          <div className="mt-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600 dark:text-gray-400">Progresso Geral</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{overallProgress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                className="h-2.5 rounded-full bg-purple-600" 
                style={{ width: `${overallProgress}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráficos */}
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
                <p className="text-gray-500">Nenhuma meta registrada</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Gráfico de Progresso por Meta */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Progresso por Meta</h2>
          </CardHeader>
          <CardContent className="h-80">
            {progressChartData.length > 0 ? (
              <Chart
                data={progressChartData}
                type="bar"
                series={[{ dataKey: 'progresso', name: 'Progresso (%)' }]}
                xAxisDataKey="name"
                size="auto"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Nenhuma meta registrada</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Lista de Metas */}
      <GoalList
        goals={goals}
        isLoading={isLoading}
        onViewDetail={handleOpenDetail}
        onEdit={handleOpenForm}
        onDelete={handleDeleteGoal}
      />

      {/* Modal de Formulário */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedGoal ? 'Editar Meta' : 'Nova Meta'}
      >
        <GoalForm
          goal={selectedGoal || undefined}
          onSuccess={handleFormSuccess}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      {/* Modal de Detalhes */}
      {selectedGoal && (
        <Modal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title="Detalhes da Meta"
          size="2xl"
        >
          <GoalDetail
            goal={selectedGoal}
            onEdit={(goal) => {
              setIsDetailOpen(false);
              handleOpenForm(goal);
            }}
            onClose={() => setIsDetailOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default GoalsPage;