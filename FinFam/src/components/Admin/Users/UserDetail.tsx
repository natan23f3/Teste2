import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../UI/Card';
import { Badge } from '../../UI/Badge';
import { Button } from '../../UI/Button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../UI/Table';
import { Chart } from '../../UI/Chart';

/**
 * Interface para os dados de usuário
 */
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  createdAt: string;
  permissions: string[];
  loginHistory: Array<{
    date: string;
    ip: string;
    device: string;
  }>;
  activityData: Array<{
    month: string;
    logins: number;
    actions: number;
  }>;
}

/**
 * Interface para as props do componente
 */
interface UserDetailProps {
  userId?: number;
  onBack: () => void;
}

/**
 * Componente que exibe os detalhes de um usuário específico
 */
const UserDetail: React.FC<UserDetailProps> = ({ userId = 1, onBack }) => {
  // Dados de exemplo - em um cenário real, estes dados viriam de uma API
  const user: User = {
    id: 1,
    name: 'Admin Principal',
    email: 'admin@finfam.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2025-06-12T10:30:00',
    createdAt: '2024-01-01T00:00:00',
    permissions: [
      'users.view',
      'users.create',
      'users.edit',
      'users.delete',
      'customers.view',
      'customers.create',
      'customers.edit',
      'customers.delete',
      'settings.view',
      'settings.edit',
    ],
    loginHistory: [
      {
        date: '2025-06-12T10:30:00',
        ip: '192.168.1.1',
        device: 'Chrome / Windows',
      },
      {
        date: '2025-06-11T14:45:00',
        ip: '192.168.1.1',
        device: 'Chrome / Windows',
      },
      {
        date: '2025-06-10T09:15:00',
        ip: '192.168.1.1',
        device: 'Chrome / Windows',
      },
      {
        date: '2025-06-09T16:20:00',
        ip: '192.168.1.1',
        device: 'Chrome / Windows',
      },
      {
        date: '2025-06-08T11:05:00',
        ip: '192.168.1.1',
        device: 'Chrome / Windows',
      },
    ],
    activityData: [
      { month: 'Jan', logins: 22, actions: 145 },
      { month: 'Fev', logins: 25, actions: 152 },
      { month: 'Mar', logins: 28, actions: 168 },
      { month: 'Abr', logins: 24, actions: 142 },
      { month: 'Mai', logins: 30, actions: 180 },
      { month: 'Jun', logins: 26, actions: 155 },
    ],
  };

  // Função para formatar data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Função para formatar data e hora
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Função para renderizar o badge de função
  const renderRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="primary">Administrador</Badge>;
      case 'manager':
        return <Badge variant="info">Gerente</Badge>;
      case 'support':
        return <Badge variant="warning">Suporte</Badge>;
      case 'user':
        return <Badge variant="secondary">Usuário</Badge>;
      default:
        return <Badge variant="secondary">{role}</Badge>;
    }
  };

  // Função para renderizar o badge de status
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Ativo</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inativo</Badge>;
      case 'suspended':
        return <Badge variant="danger">Suspenso</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Detalhes do Usuário</h2>
        <Button variant="outline" onClick={onBack}>
          Voltar para Lista
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Informações Básicas */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Informações do Usuário</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Nome</p>
                <p className="text-base">{user.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                <p className="text-base">{user.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Função</p>
                <p className="text-base">{renderRoleBadge(user.role)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
                <p className="text-base">{renderStatusBadge(user.status)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Data de Criação</p>
                <p className="text-base">{formatDate(user.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Último Login</p>
                <p className="text-base">{formatDateTime(user.lastLogin)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ações Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle>Ações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="primary" className="w-full">
                Editar Usuário
              </Button>
              <Button variant="outline" className="w-full">
                Redefinir Senha
              </Button>
              {user.status === 'active' ? (
                <Button variant="danger" className="w-full">
                  Suspender Usuário
                </Button>
              ) : user.status === 'suspended' ? (
                <Button variant="success" className="w-full">
                  Reativar Usuário
                </Button>
              ) : (
                <Button variant="success" className="w-full">
                  Ativar Usuário
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Atividade */}
      <Card>
        <CardHeader>
          <CardTitle>Atividade do Usuário</CardTitle>
          <CardDescription>Logins e ações nos últimos 6 meses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <Chart
              type="bar"
              data={user.activityData}
              series={[
                {
                  dataKey: 'logins',
                  name: 'Logins',
                  color: '#3b82f6', // blue-500
                },
                {
                  dataKey: 'actions',
                  name: 'Ações',
                  color: '#10b981', // green-500
                },
              ]}
              xAxisDataKey="month"
              showGrid={true}
              showTooltip={true}
              showLegend={true}
              legendPosition="bottom"
              size="auto"
            />
          </div>
        </CardContent>
      </Card>

      {/* Permissões */}
      <Card>
        <CardHeader>
          <CardTitle>Permissões</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {user.permissions.map((permission, index) => (
              <Badge key={index} variant="secondary">
                {permission}
              </Badge>
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <Button variant="outline" size="sm">
              Gerenciar Permissões
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Histórico de Login */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Login</CardTitle>
        </CardHeader>
        <CardContent>
          <Table
            data={user.loginHistory}
            columns={[
              {
                header: 'Data/Hora',
                accessor: 'date',
                cell: (value) => formatDateTime(value),
              },
              {
                header: 'Endereço IP',
                accessor: 'ip',
              },
              {
                header: 'Dispositivo',
                accessor: 'device',
              },
            ]}
            striped
            hoverable
          />
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onBack}>
          Voltar
        </Button>
        <Button variant="primary">Editar Usuário</Button>
      </div>
    </div>
  );
};

export default UserDetail;