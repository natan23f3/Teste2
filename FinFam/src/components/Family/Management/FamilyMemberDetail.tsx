import React from 'react';
import { useFamily } from '../../../hooks/useFamily';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardFooter 
} from '../../UI/Card';
import { Button } from '../../UI/Button';
import { Badge } from '../../UI/Badge';

interface FamilyMember {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'pending' | 'inactive';
  joinedAt: string;
  lastActive?: string;
  phone?: string;
  avatar?: string;
  permissions?: string[];
}

interface FamilyMemberDetailProps {
  memberId: number;
  onEdit: (memberId: number) => void;
  onBack: () => void;
  onChangePermissions: (memberId: number) => void;
}

const FamilyMemberDetail: React.FC<FamilyMemberDetailProps> = ({
  memberId,
  onEdit,
  onBack,
  onChangePermissions
}) => {
  const { selectedFamily } = useFamily();

  // Dados de exemplo - em produção, estes viriam da API
  const member: FamilyMember = {
    id: memberId,
    name: 'João Silva',
    email: 'joao@example.com',
    role: 'Administrador',
    status: 'active',
    joinedAt: '2025-01-15',
    lastActive: '2025-06-12T14:30:00',
    phone: '(11) 98765-4321',
    permissions: ['gerenciar_membros', 'visualizar_despesas', 'editar_orçamentos']
  };

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

  // Função para formatar data e hora
  const formatDateTime = (dateString: string) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleString('pt-BR');
    } catch (error) {
      return 'Data inválida';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Detalhes do Membro</CardTitle>
          <Button variant="outline" size="sm" onClick={onBack}>
            Voltar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center text-2xl text-gray-600">
            {member.avatar ? (
              <img 
                src={member.avatar} 
                alt={member.name} 
                className="h-full w-full rounded-full object-cover" 
              />
            ) : (
              member.name.charAt(0)
            )}
          </div>
          <div>
            <h3 className="text-xl font-semibold">{member.name}</h3>
            <p className="text-gray-600">{member.email}</p>
            <div className="mt-1">{renderStatus(member.status)}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-200 pt-4">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Informações Básicas</h4>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-gray-500">Função:</dt>
                <dd>{member.role}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Telefone:</dt>
                <dd>{member.phone || 'Não informado'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Data de Entrada:</dt>
                <dd>{new Date(member.joinedAt).toLocaleDateString('pt-BR')}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Última Atividade:</dt>
                <dd>{member.lastActive ? formatDateTime(member.lastActive) : 'N/A'}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h4 className="font-medium text-gray-700 mb-2">Permissões</h4>
            <div className="space-y-1">
              {member.permissions && member.permissions.length > 0 ? (
                member.permissions.map((permission, index) => (
                  <Badge key={index} variant="outline" className="mr-2 mb-2">
                    {permission.replace(/_/g, ' ')}
                  </Badge>
                ))
              ) : (
                <p className="text-gray-500">Nenhuma permissão específica</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Button variant="outline" onClick={() => onEdit(member.id)}>
          Editar Informações
        </Button>
        <Button onClick={() => onChangePermissions(member.id)}>
          Gerenciar Permissões
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FamilyMemberDetail;