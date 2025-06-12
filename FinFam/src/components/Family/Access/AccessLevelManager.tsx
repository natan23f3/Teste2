import React, { useState } from 'react';
import { useFamily } from '../../../hooks/useFamily';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardDescription 
} from '../../UI/Card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../UI/Table';
import { Button } from '../../UI/Button';
import { Badge } from '../../UI/Badge';
import { Select } from '../../UI/Select';
import { Alert } from '../../UI/Alert';

interface FamilyMember {
  id: number;
  name: string;
  email: string;
  role: string;
  accessLevel: 'admin' | 'editor' | 'viewer';
}

interface AccessLevelManagerProps {
  onEditPermissions: (memberId: number) => void;
  onEditRoles: () => void;
}

const AccessLevelManager: React.FC<AccessLevelManagerProps> = ({
  onEditPermissions,
  onEditRoles
}) => {
  const { selectedFamily } = useFamily();
  const [members, setMembers] = useState<FamilyMember[]>([
    {
      id: 1,
      name: 'João Silva',
      email: 'joao@example.com',
      role: 'Administrador',
      accessLevel: 'admin'
    },
    {
      id: 2,
      name: 'Maria Oliveira',
      email: 'maria@example.com',
      role: 'Membro',
      accessLevel: 'editor'
    },
    {
      id: 3,
      name: 'Pedro Santos',
      email: 'pedro@example.com',
      role: 'Membro',
      accessLevel: 'viewer'
    }
  ]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);

  // Opções para o select de nível de acesso
  const accessLevelOptions = [
    { value: 'admin', label: 'Administrador (Acesso Total)' },
    { value: 'editor', label: 'Editor (Pode Editar)' },
    { value: 'viewer', label: 'Visualizador (Somente Leitura)' }
  ];

  // Função para atualizar o nível de acesso de um membro
  const handleAccessLevelChange = async (memberId: number, newLevel: string) => {
    setIsUpdating(true);
    setUpdateSuccess(null);
    setUpdateError(null);

    try {
      // Em produção, aqui faria uma chamada à API
      // Simulando uma atualização para exemplo
      setTimeout(() => {
        setMembers(prev => 
          prev.map(member => 
            member.id === memberId 
              ? { ...member, accessLevel: newLevel as 'admin' | 'editor' | 'viewer' } 
              : member
          )
        );
        setUpdateSuccess('Nível de acesso atualizado com sucesso');
        setIsUpdating(false);
        
        // Limpar a mensagem de sucesso após 3 segundos
        setTimeout(() => setUpdateSuccess(null), 3000);
      }, 1000);
    } catch (error) {
      setUpdateError('Erro ao atualizar nível de acesso');
      setIsUpdating(false);
      console.error(error);
    }
  };

  // Função para renderizar o badge de nível de acesso
  const renderAccessLevelBadge = (level: 'admin' | 'editor' | 'viewer') => {
    switch (level) {
      case 'admin':
        return <Badge variant="primary">Administrador</Badge>;
      case 'editor':
        return <Badge variant="success">Editor</Badge>;
      case 'viewer':
        return <Badge variant="secondary">Visualizador</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Gerenciamento de Acesso</CardTitle>
            <CardDescription>
              Defina os níveis de acesso para cada membro da família
            </CardDescription>
          </div>
          <Button onClick={onEditRoles}>
            Configurar Funções
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {updateSuccess && (
          <Alert variant="success" className="mb-4">
            {updateSuccess}
          </Alert>
        )}
        
        {updateError && (
          <Alert variant="danger" className="mb-4">
            {updateError}
          </Alert>
        )}
        
        <Table
          bordered
          hoverable
          data={members}
          columns={[
            { header: 'Nome', accessor: 'name' },
            { header: 'Email', accessor: 'email' },
            { header: 'Função', accessor: 'role' },
            { 
              header: 'Nível de Acesso', 
              accessor: 'accessLevel',
              cell: (value: any) => renderAccessLevelBadge(value as 'admin' | 'editor' | 'viewer')
            },
            {
              header: 'Alterar Acesso',
              accessor: 'id',
              cell: (value: any, row: Record<string, any>) => (
                <Select
                  options={accessLevelOptions}
                  value={row.accessLevel}
                  onChange={(e) => handleAccessLevelChange(value as number, e.target.value)}
                  disabled={isUpdating}
                  size="sm"
                />
              )
            },
            {
              header: 'Permissões',
              accessor: 'id',
              cell: (value: any) => (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onEditPermissions(value as number)}
                >
                  Editar Permissões
                </Button>
              )
            }
          ]}
        />
        
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Níveis de Acesso:</h4>
          <ul className="text-sm space-y-1">
            <li className="flex items-center">
              <Badge variant="primary" className="mr-2">Administrador</Badge>
              <span>Acesso total a todas as funcionalidades da família</span>
            </li>
            <li className="flex items-center">
              <Badge variant="success" className="mr-2">Editor</Badge>
              <span>Pode visualizar e editar dados, mas não pode gerenciar membros</span>
            </li>
            <li className="flex items-center">
              <Badge variant="secondary" className="mr-2">Visualizador</Badge>
              <span>Somente visualização, sem permissão para editar dados</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccessLevelManager;