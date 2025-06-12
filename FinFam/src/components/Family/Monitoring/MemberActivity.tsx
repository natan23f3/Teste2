import React, { useState } from 'react';
import { useFamily } from '../../../hooks/useFamily';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '../../UI/Card';
import { Table } from '../../UI/Table';
import { Button } from '../../UI/Button';
import { Badge } from '../../UI/Badge';
import { Chart } from '../../UI/Chart';

interface MemberActivityProps {
  onViewMemberDetails: (memberId: number) => void;
}

interface ActivityLog {
  id: number;
  memberId: number;
  memberName: string;
  action: string;
  category: 'expense' | 'budget' | 'member' | 'setting';
  timestamp: string;
  details?: string;
}

const MemberActivity: React.FC<MemberActivityProps> = ({
  onViewMemberDetails
}) => {
  const { selectedFamily } = useFamily();
  const [activeView, setActiveView] = useState<'table' | 'chart'>('table');

  // Dados de exemplo para atividades dos membros
  const activityLogs: ActivityLog[] = [
    {
      id: 1,
      memberId: 1,
      memberName: 'João Silva',
      action: 'Adicionou despesa',
      category: 'expense',
      timestamp: '2025-06-12T14:30:00',
      details: 'Supermercado - R$ 250,00'
    },
    {
      id: 2,
      memberId: 2,
      memberName: 'Maria Oliveira',
      action: 'Atualizou orçamento',
      category: 'budget',
      timestamp: '2025-06-12T10:15:00',
      details: 'Orçamento de Junho'
    },
    {
      id: 3,
      memberId: 1,
      memberName: 'João Silva',
      action: 'Adicionou despesa',
      category: 'expense',
      timestamp: '2025-06-11T18:45:00',
      details: 'Restaurante - R$ 120,00'
    },
    {
      id: 4,
      memberId: 3,
      memberName: 'Pedro Santos',
      action: 'Convidou membro',
      category: 'member',
      timestamp: '2025-06-11T09:20:00',
      details: 'ana@example.com'
    },
    {
      id: 5,
      memberId: 2,
      memberName: 'Maria Oliveira',
      action: 'Adicionou despesa',
      category: 'expense',
      timestamp: '2025-06-10T16:30:00',
      details: 'Farmácia - R$ 85,00'
    },
    {
      id: 6,
      memberId: 1,
      memberName: 'João Silva',
      action: 'Alterou configurações',
      category: 'setting',
      timestamp: '2025-06-10T11:10:00',
      details: 'Notificações'
    },
    {
      id: 7,
      memberId: 3,
      memberName: 'Pedro Santos',
      action: 'Adicionou despesa',
      category: 'expense',
      timestamp: '2025-06-09T20:05:00',
      details: 'Combustível - R$ 200,00'
    }
  ];

  // Dados para o gráfico de atividades por membro
  const memberActivityData = [
    { name: 'João Silva', activities: 3 },
    { name: 'Maria Oliveira', activities: 2 },
    { name: 'Pedro Santos', activities: 2 }
  ];

  // Dados para o gráfico de atividades por categoria
  const categoryActivityData = [
    { name: 'Despesas', value: 4 },
    { name: 'Orçamentos', value: 1 },
    { name: 'Membros', value: 1 },
    { name: 'Configurações', value: 1 }
  ];

  // Função para formatar data e hora
  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('pt-BR');
    } catch (error) {
      return 'Data inválida';
    }
  };

  // Função para renderizar o badge da categoria
  const renderCategoryBadge = (category: 'expense' | 'budget' | 'member' | 'setting') => {
    switch (category) {
      case 'expense':
        return <Badge variant="primary">Despesa</Badge>;
      case 'budget':
        return <Badge variant="success">Orçamento</Badge>;
      case 'member':
        return <Badge variant="warning">Membro</Badge>;
      case 'setting':
        return <Badge variant="secondary">Configuração</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Atividade de Membros</CardTitle>
        <div className="flex space-x-2">
          <Button 
            variant={activeView === 'table' ? 'primary' : 'outline'} 
            size="sm"
            onClick={() => setActiveView('table')}
          >
            Tabela
          </Button>
          <Button 
            variant={activeView === 'chart' ? 'primary' : 'outline'} 
            size="sm"
            onClick={() => setActiveView('chart')}
          >
            Gráficos
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {activeView === 'table' ? (
          <Table
            data={activityLogs}
            columns={[
              { 
                header: 'Membro', 
                accessor: 'memberName',
                cell: (value: string, row: Record<string, any>) => (
                  <button 
                    className="text-blue-600 hover:underline"
                    onClick={() => onViewMemberDetails(row.memberId as number)}
                  >
                    {value}
                  </button>
                )
              },
              { header: 'Ação', accessor: 'action' },
              { 
                header: 'Categoria', 
                accessor: 'category',
                cell: (value: 'expense' | 'budget' | 'member' | 'setting') => renderCategoryBadge(value)
              },
              { 
                header: 'Data/Hora', 
                accessor: 'timestamp',
                cell: (value: string) => formatDateTime(value)
              },
              { header: 'Detalhes', accessor: 'details' }
            ]}
            bordered
            hoverable
          />
        ) : (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-4">Atividades por Membro</h3>
              <Chart
                type="bar"
                data={memberActivityData}
                xAxisDataKey="name"
                xAxisLabel="Membro"
                yAxisLabel="Quantidade"
                series={[
                  { dataKey: 'activities', name: 'Atividades', color: '#3b82f6' }
                ]}
                size="md"
              />
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Atividades por Categoria</h3>
              <Chart
                type="pie"
                data={categoryActivityData}
                xAxisDataKey="name"
                series={[
                  { dataKey: 'value', name: 'Quantidade' }
                ]}
                size="md"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MemberActivity;