import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardFooter,
  CardDescription 
} from '../../UI/Card';
import { Button } from '../../UI/Button';
import { Input } from '../../UI/Input';
import { Alert } from '../../UI/Alert';
import { Badge } from '../../UI/Badge';
import { Modal } from '../../UI/Modal';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../UI/Table';

interface Role {
  id: string;
  name: string;
  description: string;
  isDefault: boolean;
  permissions: string[];
}

interface RoleDefinitionProps {
  onEditRolePermissions: (roleId: string) => void;
  onClose: () => void;
}

const RoleDefinition: React.FC<RoleDefinitionProps> = ({
  onEditRolePermissions,
  onClose
}) => {
  const [roles, setRoles] = useState<Role[]>([
    {
      id: 'admin',
      name: 'Administrador',
      description: 'Acesso total a todas as funcionalidades',
      isDefault: true,
      permissions: ['*']
    },
    {
      id: 'member',
      name: 'Membro',
      description: 'Acesso padrão para membros da família',
      isDefault: true,
      permissions: [
        'view_expenses', 
        'create_expenses', 
        'view_budgets', 
        'view_members', 
        'view_reports'
      ]
    },
    {
      id: 'guest',
      name: 'Convidado',
      description: 'Acesso limitado para convidados',
      isDefault: true,
      permissions: ['view_expenses', 'view_budgets']
    },
    {
      id: 'custom_1',
      name: 'Gerente Financeiro',
      description: 'Gerencia finanças da família',
      isDefault: false,
      permissions: [
        'view_expenses', 
        'create_expenses', 
        'edit_expenses', 
        'delete_expenses', 
        'view_budgets', 
        'edit_budgets', 
        'view_reports', 
        'export_reports'
      ]
    }
  ]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Estado para o modal de nova função
  const [isAddingRole, setIsAddingRole] = useState(false);
  const [newRole, setNewRole] = useState<{name: string; description: string}>({
    name: '',
    description: ''
  });

  // Estado para o modal de confirmação de exclusão
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    roleId: string | null;
    roleName: string;
  }>({
    isOpen: false,
    roleId: null,
    roleName: ''
  });

  // Adicionar nova função
  const handleAddRole = () => {
    if (!newRole.name.trim()) {
      setError('O nome da função é obrigatório');
      return;
    }

    const roleId = `custom_${Date.now()}`;
    const role: Role = {
      id: roleId,
      name: newRole.name,
      description: newRole.description,
      isDefault: false,
      permissions: []
    };

    setRoles(prev => [...prev, role]);
    setNewRole({ name: '', description: '' });
    setIsAddingRole(false);
    setSuccess('Função criada com sucesso');
    
    // Limpar a mensagem de sucesso após 3 segundos
    setTimeout(() => setSuccess(null), 3000);
  };

  // Abrir confirmação de exclusão
  const openDeleteConfirmation = (roleId: string, roleName: string) => {
    setDeleteConfirmation({
      isOpen: true,
      roleId,
      roleName
    });
  };

  // Excluir função
  const handleDeleteRole = () => {
    if (!deleteConfirmation.roleId) return;

    setRoles(prev => prev.filter(role => role.id !== deleteConfirmation.roleId));
    setDeleteConfirmation({
      isOpen: false,
      roleId: null,
      roleName: ''
    });
    setSuccess('Função excluída com sucesso');
    
    // Limpar a mensagem de sucesso após 3 segundos
    setTimeout(() => setSuccess(null), 3000);
  };

  // Renderizar o número de permissões
  const renderPermissionCount = (permissions: string[]) => {
    if (permissions.includes('*')) {
      return <Badge variant="primary">Todas as permissões</Badge>;
    }
    return <Badge variant="secondary">{permissions.length} permissões</Badge>;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Definição de Funções</CardTitle>
            <CardDescription>
              Configure as funções disponíveis para os membros da família
            </CardDescription>
          </div>
          <Button onClick={() => setIsAddingRole(true)}>
            Nova Função
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert variant="success" className="mb-4">
            {success}
          </Alert>
        )}
        
        <Table
          bordered
          hoverable
          data={roles}
          columns={[
            { 
              header: 'Nome', 
              accessor: 'name',
              cell: (value: string, row: Record<string, any>) => (
                <div className="flex items-center">
                  {value}
                  {row.isDefault && (
                    <Badge variant="outline" className="ml-2">Padrão</Badge>
                  )}
                </div>
              )
            },
            { header: 'Descrição', accessor: 'description' },
            { 
              header: 'Permissões', 
              accessor: 'permissions',
              cell: (value: string[]) => renderPermissionCount(value)
            },
            {
              header: 'Ações',
              accessor: 'id',
              cell: (value: string, row: Record<string, any>) => (
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onEditRolePermissions(value)}
                  >
                    Editar Permissões
                  </Button>
                  {!row.isDefault && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => openDeleteConfirmation(value, row.name as string)}
                    >
                      Excluir
                    </Button>
                  )}
                </div>
              )
            }
          ]}
        />
        
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Sobre as Funções:</h4>
          <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
            <li>• Funções padrão não podem ser excluídas</li>
            <li>• Cada membro da família deve ter uma função atribuída</li>
            <li>• As permissões de cada função determinam o que os membros podem fazer</li>
            <li>• Você pode criar funções personalizadas para necessidades específicas</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end border-t pt-4">
        <Button variant="outline" onClick={onClose}>
          Fechar
        </Button>
      </CardFooter>

      {/* Modal para adicionar nova função */}
      <Modal 
        isOpen={isAddingRole} 
        onClose={() => setIsAddingRole(false)}
        title="Adicionar Nova Função"
      >
        <div className="p-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="roleName" className="text-sm font-medium">
                Nome da Função
              </label>
              <Input
                id="roleName"
                value={newRole.name}
                onChange={(e) => setNewRole(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Gerente Financeiro"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="roleDescription" className="text-sm font-medium">
                Descrição
              </label>
              <Input
                id="roleDescription"
                value={newRole.description}
                onChange={(e) => setNewRole(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descreva o propósito desta função"
              />
            </div>
            
            <div className="pt-4 flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsAddingRole(false)}
              >
                Cancelar
              </Button>
              <Button 
                type="button" 
                onClick={handleAddRole}
              >
                Adicionar Função
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Modal de confirmação de exclusão */}
      <Modal 
        isOpen={deleteConfirmation.isOpen} 
        onClose={() => setDeleteConfirmation({ isOpen: false, roleId: null, roleName: '' })}
        title="Confirmar Exclusão"
      >
        <div className="p-4">
          <p className="mb-4">
            Tem certeza que deseja excluir a função <strong>{deleteConfirmation.roleName}</strong>?
          </p>
          <p className="text-sm text-gray-600 mb-6">
            Esta ação não pode ser desfeita. Todos os membros com esta função serão redefinidos para a função padrão "Membro".
          </p>
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setDeleteConfirmation({ isOpen: false, roleId: null, roleName: '' })}
            >
              Cancelar
            </Button>
            <Button 
              variant="danger" 
              onClick={handleDeleteRole}
            >
              Excluir
            </Button>
          </div>
        </div>
      </Modal>
    </Card>
  );
};

export default RoleDefinition;