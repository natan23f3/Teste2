import React from 'react';
import { Card, CardContent } from '../../UI/Card';

/**
 * Componente que exibe uma visão geral das métricas principais do sistema
 * 
 * Mostra estatísticas como total de usuários, famílias, receita e taxa de crescimento
 */
const MetricsOverview: React.FC = () => {
  // Dados de exemplo - em um cenário real, estes dados viriam de uma API
  const metrics = [
    {
      title: 'Total de Usuários',
      value: '2.350',
      change: '+12%',
      trend: 'up',
      description: 'vs. mês anterior',
    },
    {
      title: 'Famílias Ativas',
      value: '1.204',
      change: '+8%',
      trend: 'up',
      description: 'vs. mês anterior',
    },
    {
      title: 'Receita Mensal',
      value: 'R$ 42.500',
      change: '+15%',
      trend: 'up',
      description: 'vs. mês anterior',
    },
    {
      title: 'Taxa de Retenção',
      value: '94%',
      change: '+2%',
      trend: 'up',
      description: 'vs. mês anterior',
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex flex-col space-y-1.5">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {metric.title}
              </p>
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold">{metric.value}</h2>
                <span
                  className={`flex items-center text-sm font-medium ${
                    metric.trend === 'up'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {metric.trend === 'up' ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4 mr-1"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4 mr-1"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 13a1 1 0 110 2H7a1 1 0 01-1-1v-5a1 1 0 112 0v2.586l4.293-4.293a1 1 0 011.414 0L16 9.586V7a1 1 0 112 0v5a1 1 0 01-1 1h-5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {metric.change}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {metric.description}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MetricsOverview;