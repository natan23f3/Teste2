import React, { useState } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../UI/Table';
import { Button } from '../../UI/Button';
import { Pagination } from '../../UI/Pagination';
import { Badge } from '../../UI/Badge';
import CustomerFilter from './CustomerFilter';

/**
 * Interface para os dados de cliente
 */
interface Customer {
  id: number;
  name: string;
  email: string;
  familyCount: number;
  status: 'active' | 'inactive' | 'pending';
  registrationDate: string;
  lastLogin: string;
}

/**
 * Componente que exibe uma lista de clientes com opções de filtragem e paginação
 */
const CustomerList: React.FC = () => {
  // Estado para paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Dados de exemplo - em um cenário real, estes dados viriam de uma API
  const customers: Customer[] = [
    {
      id: 1,
      name: 'Maria Silva',
      email: 'maria.silva@email.com',
      familyCount: 2,
      status: 'active',
      registrationDate: '2025-01-15',
      lastLogin: '2025-06-11',
    },
    {
      id: 2,
      name: 'João Santos',
      email: 'joao.santos@email.com',
      familyCount: 1,
      status: 'active',
      registrationDate: '2025-02-03',
      lastLogin: '2025-06-10',
    },
    {
      id: 3,
      name: 'Ana Oliveira',
      email: 'ana.oliveira@email.com',
      familyCount: 3,
      status: 'active',
      registrationDate: '2025-01-22',
      lastLogin: '2025-06-12',
    },
    {
      id: 4,
      name: 'Carlos Ferreira',
      email: 'carlos.ferreira@email.com',
      familyCount: 1,
      status: 'inactive',
      registrationDate: '2025-03-10',
      lastLogin: '2025-05-20',
    },
    {
      id: 5,
      name: 'Pedro Costa',
      email: 'pedro.costa@email.com',
      familyCount: 2,
      status: 'active',
      registrationDate: '2025-02-18',
      lastLogin: '2025-06-09',
    },
    {
      id: 6,
      name: 'Lucia Martins',
      email: 'lucia.martins@email.com',
      familyCount: 1,
      status: 'pending',
      registrationDate: '2025-06-05',
      lastLogin: '2025-06-05',
    },
    {
      id: 7,
      name: 'Roberto Almeida',
      email: 'roberto.almeida@email.com',
      familyCount: 2,
      status: 'active',
      registrationDate: '2025-04-12',
      lastLogin: '2025-06-11',
    },
    {
      id: 8,
      name: 'Fernanda Lima',
      email: 'fernanda.lima@email.com',
      familyCount: 1,
      status: 'active',
      registrationDate: '2025-03-25',
      lastLogin: '2025-06-10',
    },
    {
      id: 9,
      name: 'Ricardo Sousa',
      email: 'ricardo.sousa@email.com',
      familyCount: 3,
      status: 'inactive',
      registrationDate: '2025-01-30',
      lastLogin: '2025-04-15',
    },
    {
      id: 10,
      name: 'Camila Rocha',
      email: 'camila.rocha@email.com',
      familyCount: 2,
      status: 'active',
      registrationDate: '2025-02-28',
      lastLogin: '2025-06-12',
    },
    {
      id: 11,
      name: 'Marcelo Dias',
      email: 'marcelo.dias@email.com',
      familyCount: 1,
      status: 'active',
      registrationDate: '2025-05-10',
      lastLogin: '2025-06-11',
    },
    {
      id: 12,
      name: 'Patricia Gomes',
      email: 'patricia.gomes@email.com',
      familyCount: 2,
      status: 'pending',
      registrationDate: '2025-06-01',
      lastLogin: '2025-06-01',
    },
  ];

  // Estado para filtragem
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>(customers);

  // Função para aplicar filtros
  const applyFilters = (filters: any) => {
    let filtered = [...customers];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchLower) ||
          customer.email.toLowerCase().includes(searchLower)
      );
    }

    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter((customer) => customer.status === filters.status);
    }

    if (filters.dateRange && filters.dateRange.from && filters.dateRange.to) {
      const fromDate = new Date(filters.dateRange.from);
      const toDate = new Date(filters.dateRange.to);
      filtered = filtered.filter((customer) => {
        const regDate = new Date(customer.registrationDate);
        return regDate >= fromDate && regDate <= toDate;
      });
    }

    setFilteredCustomers(filtered);
    setCurrentPage(1); // Reset para a primeira página ao filtrar
  };

  // Cálculos para paginação
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);

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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Clientes</h2>
        <Button variant="primary">Novo Cliente</Button>
      </div>

      <CustomerFilter onFilter={applyFilters} />

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
            header: 'Famílias',
            accessor: 'familyCount',
          },
          {
            header: 'Status',
            accessor: 'status',
            cell: (value) => renderStatusBadge(value),
          },
          {
            header: 'Data de Registro',
            accessor: 'registrationDate',
            cell: (value) => formatDate(value),
          },
          {
            header: 'Último Login',
            accessor: 'lastLogin',
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

export default CustomerList;