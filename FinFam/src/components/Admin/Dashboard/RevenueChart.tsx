import React from 'react';
import { Chart } from '../../UI/Chart';

/**
 * Componente que exibe um gráfico de receita mensal
 * 
 * Mostra a receita ao longo dos últimos meses, com comparação ao ano anterior
 */
const RevenueChart: React.FC = () => {
  // Dados de exemplo - em um cenário real, estes dados viriam de uma API
  const revenueData = [
    { month: 'Jan', atual: 32500, anterior: 28000 },
    { month: 'Fev', atual: 34200, anterior: 29500 },
    { month: 'Mar', atual: 36800, anterior: 31200 },
    { month: 'Abr', atual: 38500, anterior: 32800 },
    { month: 'Mai', atual: 40200, anterior: 34500 },
    { month: 'Jun', atual: 42500, anterior: 36000 },
    { month: 'Jul', atual: 44800, anterior: 37500 },
    { month: 'Ago', atual: 46500, anterior: 39000 },
    { month: 'Set', atual: 48200, anterior: 40500 },
    { month: 'Out', atual: 50000, anterior: 42000 },
    { month: 'Nov', atual: 52500, anterior: 43500 },
    { month: 'Dez', atual: 55000, anterior: 45000 },
  ];

  return (
    <div className="h-80">
      <Chart
        type="line"
        data={revenueData}
        series={[
          {
            dataKey: 'atual',
            name: 'Ano Atual',
            color: '#3b82f6', // blue-500
            strokeWidth: 2,
          },
          {
            dataKey: 'anterior',
            name: 'Ano Anterior',
            color: '#94a3b8', // slate-400
            strokeWidth: 2,
            type: 'monotone',
          },
        ]}
        xAxisDataKey="month"
        xAxisLabel="Mês"
        yAxisLabel="Receita (R$)"
        showGrid={true}
        showTooltip={true}
        showLegend={true}
        legendPosition="bottom"
        size="auto"
      />
    </div>
  );
};

export default RevenueChart;