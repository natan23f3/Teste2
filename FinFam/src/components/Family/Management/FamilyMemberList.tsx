import React, { useState } from 'react';
import { useFamily } from '../../../hooks/useFamily';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '../../UI/Table';
import { Button } from '../../UI/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../UI/Card';
import { Pagination } from '../../UI/Pagination';
import { Badge } from '../../UI/Badge';

interface FamilyMember {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'pending' | 'inactive';
  joinedAt: string;
}

interface FamilyMemberListProps {
  onViewDetail: (memberId: number) => void;
  onEdit: (memberId: number) => void;
  onInvite: () => void;
}

const FamilyMemberList: React.FC<FamilyMemberListProps> = ({
  onViewDetail,
  onEdit,
  onInvite
}) => {
  const { selectedFamily } = useFamily();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Dados de exemplo - em produção, estes viriam da API
  const members: FamilyMember[] = [
    {
      id: 1,
      name: 'João Silva',
      email: 'joao@example.com',
      role: 'Administrador',
      status: 'active',
      joinedAt: '2025-01-15'
    },
    {
      id: 2,
      name: 'Maria Oliveira',
      email: 'maria@example.com',
      role: 'Membro',
      status: 'active',
      joinedAt: '2025-02-20'
    },
    {
      id: 3,
      name: 'Pedro Santos',
      email: 'pedro@example.com',
      role: 'Membro',
      status: 'pending',
      joinedAt: '2025-05-10'
    }
  ];

  // Lógica de paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = members.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(members.length / itemsPerPage);

  // Função para renderizar o status com badge
  const renderStatus = (status: 'active' | 'pending' | 'inactive') => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Ativo</Badge>;
      case 'pending':
        return <Badge variant="warning">Pendente</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inativo</Badge>;
      default:
        return null;
    }
  };

  // Colunas da tabela
  const columns = [
    { header: 'Nome', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Função', accessor: 'role' },
    { 
      header: 'Status', 
      accessor: 'status',
      cell: (value: 'active' | 'pending' | 'inactive') => renderStatus(value)
    },
    { 
      header: 'Data de Entrada', 
      accessor: 'joinedAt',
      cell: (value: string) => new Date(value).toLocaleDateString('pt-BR')
    },
    {
      header: 'Ações',
      accessor: 'id',
      cell: (value: number) => (
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onViewDetail(value)}
          >
            Ver
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEdit(value)}
          >
            Editar
          </Button>
        </div>
      )
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Membros da Família {selectedFamily?.name}</CardTitle>
        <Button onClick={onInvite}>Convidar Membro</Button>
      </CardHeader>
      <CardContent>
        <Table
          data={currentItems}
          columns={columns}
          bordered
          hoverable
          emptyMessage="Nenhum membro encontrado"
        />
        {members.length > itemsPerPage && (
          <div className="mt-4 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FamilyMemberList;