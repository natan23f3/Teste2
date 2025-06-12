import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../UI/Card';
import { Badge } from '../../UI/Badge';
import { Button } from '../../UI/Button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../UI/Table';
import { Chart } from '../../UI/Chart';

/**
 * Interface para os dados de cliente
 */
interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'pending';
  registrationDate: string;
  lastLogin: string;
  families: Array<{
    id: number;
    name: string;
    members: number;
    createdAt: string;
  }>;
  subscriptionPlan: string;
  paymentStatus: 'paid' | 'pending' | 'overdue';
  activityData: Array<{
    month: string;
    logins: number;
    transactions: number;
  }>;
}

/**
 * Interface para as props do componente
 */
interface CustomerDetailProps {
  customerId?: number;
  onBack: () => void;
}

/**
 * Componente que exibe os detalhes de um cliente específico
 */
const CustomerDetail: React.FC<CustomerDetailProps> = ({ customerId = 1, onBack }) => {
  // Dados de exemplo - em um cenário real, estes dados viriam de uma API
  const customer: Customer = {
    id: 1,
    name: 'Maria Silva',
    email: 'maria.silva@email.com',
    phone: '(11) 98765-4321',
    status: 'active',
    registrationDate: '2025-01-15',
    lastLogin: '2025-06-11',
    families: [
      {
        id: 101,
        name: 'Família Silva',
        members: 4,
        createdAt: '2025-01-16',
      },
      {
        id: 102,
        name: 'Família Silva-Santos',
        members: 3,
        createdAt: '2025-03-22',
      },
    ],
    subscriptionPlan: 'Premium',
    paymentStatus: 'paid',
    activityData: [
      { month: 'Jan', logins: 15, transactions: 8 },
      { month: 'Fev', logins: 12, transactions: 6 },
      { month: 'Mar', logins: 18, transactions: 10 },
      { month: 'Abr', logins: 20, transactions: 12 },
      { month: 'Mai', logins: 22, transactions: 15 },
      { month: 'Jun', logins: 25, transactions: 18 },
    ],
  };

  // Função para formatar data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Função para renderizar o badge de status
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Ativo</Badge>;
      case 'inactive':
        return <Badge variant="danger">Inativo</Badge>;
      case 'pending':
        return <Badge variant="warning">Pendente</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  // Função para renderizar o badge de status de pagamento
  const renderPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="success">Pago</Badge>;
      case 'pending':
        return <Badge variant="warning">Pendente</Badge>;
      case 'overdue':
        return <Badge variant="danger">Atrasado</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Detalhes do Cliente</h2>
        <Button variant="outline" onClick={onBack}>
          Voltar para Lista
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Informações Básicas */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Informações do Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Nome</p>
                <p className="text-base">{customer.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                <p className="text-base">{customer.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Telefone</p>
                <p className="text-base">{customer.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
                <p className="text-base">{renderStatusBadge(customer.status)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Data de Registro</p>
                <p className="text-base">{formatDate(customer.registrationDate)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Último Login</p>
                <p className="text-base">{formatDate(customer.lastLogin)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações de Assinatura */}
        <Card>
          <CardHeader>
            <CardTitle>Assinatura</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Plano</p>
                <p className="text-base">{customer.subscriptionPlan}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Status de Pagamento</p>
                <p className="text-base">{renderPaymentStatusBadge(customer.paymentStatus)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Famílias</p>
                <p className="text-base">{customer.families.length}</p>
              </div>
              <div className="pt-4">
                <Button variant="primary" size="sm" className="w-full">
                  Gerenciar Assinatura
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Atividade */}
      <Card>
        <CardHeader>
          <CardTitle>Atividade do Cliente</CardTitle>
          <CardDescription>Logins e transações nos últimos 6 meses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <Chart
              type="line"
              data={customer.activityData}
              series={[
                {
                  dataKey: 'logins',
                  name: 'Logins',
                  color: '#3b82f6', // blue-500
                  strokeWidth: 2,
                },
                {
                  dataKey: 'transactions',
                  name: 'Transações',
                  color: '#10b981', // green-500
                  strokeWidth: 2,
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

      {/* Famílias do Cliente */}
      <Card>
        <CardHeader>
          <CardTitle>Famílias</CardTitle>
        </CardHeader>
        <CardContent>
          <Table
            data={customer.families}
            columns={[
              {
                header: 'Nome da Família',
                accessor: 'name',
              },
              {
                header: 'Membros',
                accessor: 'members',
              },
              {
                header: 'Data de Criação',
                accessor: 'createdAt',
                cell: (value) => formatDate(value),
              },
              {
                header: 'Ações',
                accessor: 'id',
                cell: (value) => (
                  <Button variant="secondary" size="sm">
                    Ver Detalhes
                  </Button>
                ),
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
        <Button variant="primary">Editar Cliente</Button>
      </div>
    </div>
  );
};

export default CustomerDetail;