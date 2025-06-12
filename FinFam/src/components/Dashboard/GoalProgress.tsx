import React from 'react';
import { Card, CardHeader, CardContent } from '../UI/Card';
import { Chart } from '../UI/Chart';
import { Button } from '../UI/Button';

interface GoalProgressProps {
  isLoading: boolean;
}

// Dados simulados para metas financeiras
const mockGoals = [
  {
    id: 1,
    name: 'Fundo de Emergência',
    target: 10000,
    current: 6500,
    deadline: '2025-12-31',
    category: 'Poupança',
    priority: 'Alta'
  },
  {
    id: 2,
    name: 'Viagem de Férias',
    target: 5000,
    current: 2800,
    deadline: '2026-07-15',
    category: 'Lazer',
    priority: 'Média'
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
    priority: 'Alta'
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
];

const GoalProgress: React.FC<GoalProgressProps> = ({ isLoading }) => {
  // Calcular progresso para cada meta
  const goalsWithProgress = mockGoals.map(goal => {
    const progress = (goal.current / goal.target) * 100;
    const remainingAmount = goal.target - goal.current;
    const deadline = new Date(goal.deadline);
    const today = new Date();
    
    // Calcular meses restantes
    const monthsRemaining = 
      (deadline.getFullYear() - today.getFullYear()) * 12 + 
      (deadline.getMonth() - today.getMonth());
    
    // Calcular valor mensal necessário para atingir a meta
    const monthlyRequired = monthsRemaining > 0 ? remainingAmount / monthsRemaining : remainingAmount;
    
    // Determinar status
    let status = 'Em dia';
    if (progress < 25) {
      status = 'Atrasado';
    } else if (progress >= 100) {
      status = 'Concluído';
    }
    
    return {
      ...goal,
      progress,
      remainingAmount,
      monthsRemaining,
      monthlyRequired,
      status
    };
  });

  // Dados para o gráfico de progresso
  const progressChartData = goalsWithProgress.map(goal => ({
    name: goal.name,
    progresso: goal.progress,
    restante: 100 - goal.progress
  }));

  // Dados para o gráfico de distribuição por categoria
  const categoryData = goalsWithProgress.reduce((acc, goal) => {
    const category = goal.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += goal.target;
    return acc;
  }, {} as Record<string, number>);

  const categoryChartData = Object.entries(categoryData).map(([category, value]) => ({
    name: category,
    value
  }));

  if (isLoading) {
    return <div className="animate-pulse">Carregando dados de metas...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Resumo de Metas */}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Resumo de Metas Financeiras</h3>
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
            {/* Gráfico de Progresso */}
            <div>
              <h4 className="text-md font-medium mb-4 text-center">Progresso das Metas</h4>
              <Chart
                data={progressChartData}
                type="bar"
                series={[
                  { dataKey: 'progresso', name: 'Progresso', stack: 'a' },
                  { dataKey: 'restante', name: 'Restante', stack: 'a' }
                ]}
                xAxisDataKey="name"
                size="lg"
              />
            </div>

            {/* Gráfico de Distribuição por Categoria */}
            <div>
              <h4 className="text-md font-medium mb-4 text-center">Distribuição por Categoria</h4>
              <Chart
                data={categoryChartData}
                type="pie"
                series={[{ dataKey: 'value' }]}
                xAxisDataKey="name"
                size="lg"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Metas */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Detalhes das Metas</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            {goalsWithProgress.map((goal) => (
              <div 
                key={goal.id} 
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium text-lg">{goal.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Categoria: {goal.category} | Prioridade: {goal.priority}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    goal.status === 'Concluído' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                      : goal.status === 'Atrasado' 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' 
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                  }`}>
                    {goal.status}
                  </span>
                </div>

                <div className="mb-2">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      R$ {goal.current.toFixed(2)} de R$ {goal.target.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {goal.progress.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        goal.progress >= 100 
                          ? 'bg-green-600' 
                          : goal.progress < 25 
                            ? 'bg-red-600' 
                            : 'bg-blue-600'
                      }`} 
                      style={{ width: `${Math.min(goal.progress, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
                  <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                    <p className="text-gray-600 dark:text-gray-400">Prazo</p>
                    <p className="font-medium">{new Date(goal.deadline).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                    <p className="text-gray-600 dark:text-gray-400">Meses Restantes</p>
                    <p className="font-medium">{goal.monthsRemaining}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                    <p className="text-gray-600 dark:text-gray-400">Valor Restante</p>
                    <p className="font-medium">R$ {goal.remainingAmount.toFixed(2)}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                    <p className="text-gray-600 dark:text-gray-400">Valor Mensal Necessário</p>
                    <p className="font-medium">R$ {goal.monthlyRequired.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dicas para Atingir Metas */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Dicas para Atingir suas Metas</h3>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            <li>Estabeleça metas específicas, mensuráveis, atingíveis, relevantes e com prazo definido (SMART).</li>
            <li>Divida metas grandes em objetivos menores e mais gerenciáveis.</li>
            <li>Configure transferências automáticas para suas contas de poupança.</li>
            <li>Revise seu progresso regularmente e ajuste sua estratégia conforme necessário.</li>
            <li>Celebre pequenas vitórias ao longo do caminho para manter a motivação.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoalProgress;