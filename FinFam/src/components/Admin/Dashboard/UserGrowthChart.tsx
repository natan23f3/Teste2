import React from 'react';
import { Chart } from '../../UI/Chart';

/**
 * Componente que exibe um gráfico de crescimento de usuários
 * 
 * Mostra o crescimento de usuários e famílias ao longo dos últimos meses
 */
const UserGrowthChart: React.FC = () => {
  // Dados de exemplo - em um cenário real, estes dados viriam de uma API
  const growthData = [
    { month: 'Jan', usuarios: 1850, familias: 920 },
    { month: 'Fev', usuarios: 1920, familias: 960 },
    { month: 'Mar', usuarios: 2000, familias: 1000 },
    { month: 'Abr', usuarios: 2080, familias: 1040 },
    { month: 'Mai', usuarios: 2150, familias: 1080 },
    { month: 'Jun', usuarios: 2230, familias: 1120 },
    { month: 'Jul', usuarios: 2290, familias: 1150 },
    { month: 'Ago', usuarios: 2350, familias: 1180 },
    { month: 'Set', usuarios: 2400, familias: 1200 },
    { month: 'Out', usuarios: 2450, familias: 1220 },
    { month: 'Nov', usuarios: 2500, familias: 1240 },
    { month: 'Dez', usuarios: 2550, familias: 1260 },
  ];

  return (
    <div className="h-80">
      <Chart
        type="bar"
        data={growthData}
        series={[
          {
            dataKey: 'usuarios',
            name: 'Usuários',
            color: '#8b5cf6', // violet-500
            fillOpacity: 0.8,
          },
          {
            dataKey: 'familias',
            name: 'Famílias',
            color: '#ec4899', // pink-500
            fillOpacity: 0.8,
          },
        ]}
        xAxisDataKey="month"
        xAxisLabel="Mês"
        yAxisLabel="Quantidade"
        showGrid={true}
        showTooltip={true}
        showLegend={true}
        legendPosition="bottom"
        size="auto"
      />
    </div>
  );
};

export default UserGrowthChart;