import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../UI/Table';
import { Badge } from '../../UI/Badge';

/**
 * Componente que exibe um log de atividades recentes no sistema
 * 
 * Mostra as ações realizadas pelos usuários, com informações como tipo de ação,
 * usuário, data/hora e status
 */
const ActivityLog: React.FC = () => {
  // Dados de exemplo - em um cenário real, estes dados viriam de uma API
  const activities = [
    {
      id: 1,
      action: 'Login',
      user: 'maria.silva@email.com',
      userType: 'Usuário',
      timestamp: '2025-06-12T14:32:45',
      status: 'success',
    },
    {
      id: 2,
      action: 'Criação de Família',
      user: 'joao.santos@email.com',
      userType: 'Usuário',
      timestamp: '2025-06-12T13:45:12',
      status: 'success',
    },
    {
      id: 3,
      action: 'Adição de Membro',
      user: 'ana.oliveira@email.com',
      userType: 'Usuário',
      timestamp: '2025-06-12T12:18:30',
      status: 'success',
    },
    {
      id: 4,
      action: 'Atualização de Orçamento',
      user: 'carlos.ferreira@email.com',
      userType: 'Usuário',
      timestamp: '2025-06-12T11:05:22',
      status: 'success',
    },
    {
      id: 5,
      action: 'Tentativa de Login',
      user: 'pedro.costa@email.com',
      userType: 'Usuário',
      timestamp: '2025-06-12T10:42:18',
      status: 'error',
    },
    {
      id: 6,
      action: 'Alteração de Configurações',
      user: 'admin@finfam.com',
      userType: 'Admin',
      timestamp: '2025-06-12T09:30:45',
      status: 'success',
    },
    {
      id: 7,
      action: 'Registro de Usuário',
      user: 'lucia.martins@email.com',
      userType: 'Usuário',
      timestamp: '2025-06-12T08:15:33',
      status: 'success',
    },
  ];

  // Função para formatar a data/hora
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Função para renderizar o badge de status
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="success">Sucesso</Badge>;
      case 'error':
        return <Badge variant="danger">Erro</Badge>;
      case 'warning':
        return <Badge variant="warning">Alerta</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  return (
    <Table
      data={activities}
      columns={[
        {
          header: 'Ação',
          accessor: 'action',
        },
        {
          header: 'Usuário',
          accessor: 'user',
        },
        {
          header: 'Tipo',
          accessor: 'userType',
          cell: (value) => (
            <Badge variant={value === 'Admin' ? 'primary' : 'secondary'}>
              {value}
            </Badge>
          ),
        },
        {
          header: 'Data/Hora',
          accessor: 'timestamp',
          cell: (value) => formatTimestamp(value),
        },
        {
          header: 'Status',
          accessor: 'status',
          cell: (value) => renderStatusBadge(value),
        },
      ]}
      striped
      hoverable
    />
  );
};

export default ActivityLog;