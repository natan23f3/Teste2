import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '../UI/Card';
import { Button } from '../UI/Button';
import { Chart } from '../UI/Chart';
import { Goal } from './GoalForm';

interface GoalDetailProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onClose: () => void;
}

const GoalDetail: React.FC<GoalDetailProps> = ({
  goal,
  onEdit,
  onClose
}) => {
  // Calcular progresso
  const progress = (goal.current / goal.target) * 100;
  const remaining = goal.target - goal.current;
  
  // Calcular meses restantes
  const deadline = new Date(goal.deadline);
  const today = new Date();
  const monthsRemaining = 
    (deadline.getFullYear() - today.getFullYear()) * 12 + 
    (deadline.getMonth() - today.getMonth());
  
  // Calcular valor mensal necessário para atingir a meta
  const monthlyRequired = monthsRemaining > 0 ? remaining / monthsRemaining : remaining;
  
  // Determinar status
  let status = 'Em dia';
  if (progress >= 100) {
    status = 'Concluído';
  } else if (monthsRemaining <= 0) {
    status = 'Atrasado';
  } else if (progress < 25 && monthsRemaining < 3) {
    status = 'Em risco';
  }

  // Formatar data
  const formattedDeadline = new Date(goal.deadline).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  // Dados para o gráfico de progresso
  const progressData = [
    { name: 'Progresso', concluído: goal.current, restante: remaining > 0 ? remaining : 0 }
  ];

  // Dados para o gráfico de projeção (simulado)
  const projectionData = [];
  const projectionMonths = Math.min(monthsRemaining, 12);
  const currentDate = new Date();
  
  let projectedValue = goal.current;
  const monthlyContribution = monthlyRequired;
  
  for (let i = 0; i <= projectionMonths; i++) {
    const projectionDate = new Date(currentDate);
    projectionDate.setMonth(currentDate.getMonth() + i);
    const monthName = projectionDate.toLocaleDateString('pt-BR', { month: 'short' });
    
    projectionData.push({
      month: i === 0 ? 'Atual' : monthName,
      valor: projectedValue
    });
    
    projectedValue += monthlyContribution;
    if (projectedValue > goal.target) {
      projectedValue = goal.target;
    }
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{goal.name}</h2>
          <p className="text-gray-600 dark:text-gray-400">Categoria: {goal.category}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          status === 'Concluído' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
            : status === 'Atrasado' || status === 'Em risco'
              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' 
              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
        }`}>
          {status}
        </span>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Descrição (se houver) */}
        {goal.description && (
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Descrição</p>
            <p>{goal.description}</p>
          </div>
        )}
        
        {/* Informações Básicas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Valor Alvo</p>
            <p className="text-lg font-medium text-blue-600 dark:text-blue-400">
              R$ {goal.target.toFixed(2)}
            </p>
          </div>
          
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Valor Atual</p>
            <p className="text-lg font-medium text-green-600 dark:text-green-400">
              R$ {goal.current.toFixed(2)}
            </p>
          </div>
          
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Valor Restante</p>
            <p className="text-lg font-medium text-red-600 dark:text-red-400">
              R$ {remaining.toFixed(2)}
            </p>
          </div>
        </div>
        
        {/* Barra de Progresso */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-600 dark:text-gray-400">Progresso</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">{progress.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${
                progress >= 100 
                  ? 'bg-green-600' 
                  : progress >= 50 
                    ? 'bg-blue-600' 
                    : 'bg-yellow-500'
              }`} 
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
        </div>
        
        {/* Gráficos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gráfico de Progresso */}
          <div>
            <h3 className="text-lg font-medium mb-4">Progresso Atual</h3>
            <Chart
              data={progressData}
              type="bar"
              series={[
                { dataKey: 'concluído', name: 'Valor Atual' },
                { dataKey: 'restante', name: 'Valor Restante' }
              ]}
              xAxisDataKey="name"
              size="lg"
              showLegend={true}
            />
          </div>

          {/* Gráfico de Projeção */}
          <div>
            <h3 className="text-lg font-medium mb-4">Projeção de Crescimento</h3>
            <Chart
              data={projectionData}
              type="line"
              series={[{ dataKey: 'valor', name: 'Valor Projetado' }]}
              xAxisDataKey="month"
              size="lg"
            />
          </div>
        </div>
        
        {/* Informações de Prazo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Prazo</p>
            <p className="text-lg font-medium">{formattedDeadline}</p>
          </div>
          
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Meses Restantes</p>
            <p className="text-lg font-medium">{monthsRemaining}</p>
          </div>
          
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Valor Mensal Necessário</p>
            <p className="text-lg font-medium">R$ {monthlyRequired.toFixed(2)}</p>
          </div>
        </div>
        
        {/* Recomendações */}
        <div className={`p-4 rounded-lg ${
          status === 'Concluído' 
            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
            : status === 'Atrasado' || status === 'Em risco'
              ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' 
              : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
        }`}>
          <h3 className="text-lg font-medium mb-2">Análise e Recomendações</h3>
          <ul className="list-disc pl-5 space-y-1">
            {status === 'Concluído' ? (
              <>
                <li>Parabéns! Você atingiu sua meta financeira.</li>
                <li>Considere definir uma nova meta ou aumentar o valor alvo desta meta.</li>
                <li>Avalie a possibilidade de diversificar seus investimentos com o valor acumulado.</li>
              </>
            ) : status === 'Atrasado' ? (
              <>
                <li>O prazo para esta meta já passou. Considere revisar o prazo ou ajustar o valor alvo.</li>
                <li>Avalie a possibilidade de aumentar suas contribuições mensais.</li>
                <li>Considere dividir esta meta em objetivos menores e mais gerenciáveis.</li>
              </>
            ) : status === 'Em risco' ? (
              <>
                <li>Esta meta está em risco de não ser atingida no prazo estabelecido.</li>
                <li>Para atingir o objetivo, você precisará contribuir R$ {monthlyRequired.toFixed(2)} por mês.</li>
                <li>Considere revisar seu orçamento para aumentar as contribuições ou ajustar o prazo.</li>
              </>
            ) : (
              <>
                <li>Você está no caminho certo para atingir sua meta financeira.</li>
                <li>Continue contribuindo R$ {monthlyRequired.toFixed(2)} por mês para atingir o objetivo no prazo.</li>
                <li>Considere aumentar suas contribuições para atingir a meta mais rapidamente.</li>
              </>
            )}
          </ul>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>
          Fechar
        </Button>
        <Button onClick={() => onEdit(goal)}>
          Editar Meta
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GoalDetail;