import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../UI/Card';
import MetricsOverview from './MetricsOverview';
import RevenueChart from './RevenueChart';
import UserGrowthChart from './UserGrowthChart';
import ActivityLog from './ActivityLog';

/**
 * Componente principal do Dashboard Administrativo
 * 
 * Exibe uma visão geral das métricas, gráficos de receita e crescimento de usuários,
 * e um log de atividades recentes
 */
const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Administrativo</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Última atualização: {new Date().toLocaleString('pt-BR')}
          </span>
        </div>
      </div>

      {/* Visão geral das métricas */}
      <MetricsOverview />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Gráfico de receita */}
        <Card>
          <CardHeader>
            <CardTitle>Receita Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart />
          </CardContent>
        </Card>

        {/* Gráfico de crescimento de usuários */}
        <Card>
          <CardHeader>
            <CardTitle>Crescimento de Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            <UserGrowthChart />
          </CardContent>
        </Card>
      </div>

      {/* Log de atividades */}
      <Card>
        <CardHeader>
          <CardTitle>Atividades Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityLog />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;