import React, { useState } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../UI/Table';
import { Button } from '../../UI/Button';
import { Pagination } from '../../UI/Pagination';
import { Badge } from '../../UI/Badge';
import { Input } from '../../UI/Input';
import { Card, CardContent } from '../../UI/Card';
import { Select } from '../../UI/Select';

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
}

/**
 * Componente que exibe uma lista de usuários com opções de filtragem e paginação
 */
const UserList: React.FC = () => {
  // Estado para paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Estado para filtragem
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Dados de exemplo - em um cenário real, estes dados viriam de uma API
  const users: User[] = [
    {
      id: 1,
      name: 'Admin Principal',
      email: 'admin@finfam.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2025-06-12T10:30:00',
      createdAt: '2024-01-01T00:00:00',
    },
    {
      id: 2,
      name: 'Maria Silva',
      email: 'maria.silva@email.com',
      role: 'user',
      status: 'active',
      lastLogin: '2025-06-11T15:45:00',
      createdAt: '2025-01-15T09:30:00',
    },
    {
      id: 3,
      name: 'João Santos',
      email: 'joao.santos@email.com',
      role: 'user',
      status: 'active',
      lastLogin: '2025-06-10T08:20:00',
      createdAt: '2025-02-03T14:15:00',
    },
    {
      id: 4,
      name: 'Ana Oliveira',
      email: 'ana.oliveira@email.com',
      role: 'support',
      status: 'active',
      lastLogin: '2025-06-12T09:10:00',
      createdAt: '2025-01-22T11:45:00',
    },
    {
      id: 5,
      name: 'Carlos Ferreira',
      email: 'carlos.ferreira@email.com',
      role: 'user',
      status: 'inactive',
      lastLogin: '2025-05-20T16:30:00',
      createdAt: '2025-03-10T10:00:00',
    },
    {
      id: 6,
      name: 'Pedro Costa',
      email: 'pedro.costa@email.com',
      role: 'user',
      status: 'suspended',
      lastLogin: '2025-05-15T11:20:00',
      createdAt: '2025-02-18T08:30:00',
    },
    {
      id: 7,
      name: 'Lucia Martins',
      email: 'lucia.martins@email.com',
      role: 'manager',
      status: 'active',
      lastLogin: '2025-06-11T14:25:00',
      createdAt: '2025-04-05T09:15:00',
    },
    {
      id: 8,
      name: 'Roberto Almeida',
      email: 'roberto.almeida@email.com',
      role: 'support',
      status: 'active',
      lastLogin: '2025-06-10T10:40:00',
      createdAt: '2025-03-20T13:50:00',
    },
    {
      id: 9,
      name: 'Fernanda Lima',
      email: 'fernanda.lima@email.com',
      role: 'user',
      status: 'active',
      lastLogin: '2025-06-09T16:15:00',
      createdAt: '2025-02-25T15:30:00',
    },
    {
      id: 10,
      name: 'Ricardo Sousa',
      email: 'ricardo.sousa@email.com',
      role: 'user',
      status: 'inactive',
      lastLogin: '2025-04-30T09:50:00',
      createdAt: '2025-01-30T11:20:00',
    },
    {
      id: 11,
      name: 'Camila Rocha',
      email: 'camila.rocha@email.com',
      role: 'manager',
      status: 'active',
      lastLogin: '2025-06-12T11:30:00',
      createdAt: '2025-03-15T10:45:00',
    },
    {
      id: 12,
      name: 'Marcelo Dias',
      email: 'marcelo.dias@email.com',
      role: 'user',
      status: 'active',
      lastLogin: '2025-06-11T13:20:00',
      createdAt: '2025-05-10T09:30:00',
    },
  ];

  // Opções para o filtro de função
  const roleOptions = [
    { value: 'all', label: 'Todas as Funções' },
    { value: 'admin', label: 'Administrador' },
    { value: 'manager', label: 'Gerente' },
    { value: 'support', label: 'Suporte' },
    { value: 'user', label: 'Usuário' },
  ];

  // Opções para o filtro de status
  const statusOptions = [
    { value: 'all', label: 'Todos os Status' },
    { value: 'active', label: 'Ativo' },
    { value: 'inactive', label: 'Inativo' },
    { value: 'suspended', label: 'Suspenso' },
  ];

  // Filtrar usuários com base nos filtros aplicados
  const filteredUsers = users.filter((user) => {
    // Filtro de busca
    const matchesSearch =
      searchTerm === '' ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtro de função
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;

    // Filtro de status
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Cálculos para paginação
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Usuários</h2>
        <Button variant="primary">Novo Usuário</Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Buscar
              </label>
              <Input
                id="search"
                type="text"
                placeholder="Nome ou email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Função
              </label>
              <Select
                id="role"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                options={roleOptions}
              />
            </div>
            
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <Select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={statusOptions}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Usuários */}
      <Table
        data={currentItems}
        columns={[
          {
            header: 'Nome',
            accessor: 'name',
          },
          {
            header: 'Email',
            accessor: 'email',
          },
          {
            header: 'Função',
            accessor: 'role',
            cell: (value) => renderRoleBadge(value),
          },
          {
            header: 'Status',
            accessor: 'status',
            cell: (value) => renderStatusBadge(value),
          },
          {
            header: 'Último Login',
            accessor: 'lastLogin',
            cell: (value) => formatDateTime(value),
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
              <div className="flex space-x-2">
                <Button variant="secondary" size="sm">
                  Detalhes
                </Button>
                <Button variant="outline" size="sm">
                  Editar
                </Button>
              </div>
            ),
          },
        ]}
        striped
        hoverable
      />

      {/* Paginação */}
      <div className="flex justify-end mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          showFirstLast
          showPrevNext
        />
      </div>
    </div>
  );
};

export default UserList;