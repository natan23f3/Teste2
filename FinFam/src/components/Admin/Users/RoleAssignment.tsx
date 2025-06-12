import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../UI/Card';
import { Button } from '../../UI/Button';
import { Badge } from '../../UI/Badge';

/**
 * Interface para as permissões
 */
interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

/**
 * Interface para as props do componente
 */
interface RoleAssignmentProps {
  userId?: number;
  userName?: string;
  userRole?: string;
  initialPermissions?: string[];
  onSave: (permissions: string[]) => void;
  onCancel: () => void;
}

/**
 * Componente para atribuição de funções e permissões a um usuário
 */
const RoleAssignment: React.FC<RoleAssignmentProps> = ({
  userId = 1,
  userName = 'Admin Principal',
  userRole = 'admin',
  initialPermissions = [],
  onSave,
  onCancel,
}) => {
  // Estado para as permissões selecionadas
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(initialPermissions);

  // Dados de exemplo - em um cenário real, estes dados viriam de uma API
  const availablePermissions: Permission[] = [
    // Permissões de Usuários
    {
      id: 'users.view',
      name: 'Visualizar Usuários',
      description: 'Permite visualizar a lista de usuários e detalhes',
      category: 'Usuários',
    },
    {
      id: 'users.create',
      name: 'Criar Usuários',
      description: 'Permite criar novos usuários',
      category: 'Usuários',
    },
    {
      id: 'users.edit',
      name: 'Editar Usuários',
      description: 'Permite editar usuários existentes',
      category: 'Usuários',
    },
    {
      id: 'users.delete',
      name: 'Excluir Usuários',
      description: 'Permite excluir usuários',
      category: 'Usuários',
    },
    
    // Permissões de Clientes
    {
      id: 'customers.view',
      name: 'Visualizar Clientes',
      description: 'Permite visualizar a lista de clientes e detalhes',
      category: 'Clientes',
    },
    {
      id: 'customers.create',
      name: 'Criar Clientes',
      description: 'Permite criar novos clientes',
      category: 'Clientes',
    },
    {
      id: 'customers.edit',
      name: 'Editar Clientes',
      description: 'Permite editar clientes existentes',
      category: 'Clientes',
    },
    {
      id: 'customers.delete',
      name: 'Excluir Clientes',
      description: 'Permite excluir clientes',
      category: 'Clientes',
    },
    
    // Permissões de Famílias
    {
      id: 'families.view',
      name: 'Visualizar Famílias',
      description: 'Permite visualizar a lista de famílias e detalhes',
      category: 'Famílias',
    },
    {
      id: 'families.create',
      name: 'Criar Famílias',
      description: 'Permite criar novas famílias',
      category: 'Famílias',
    },
    {
      id: 'families.edit',
      name: 'Editar Famílias',
      description: 'Permite editar famílias existentes',
      category: 'Famílias',
    },
    {
      id: 'families.delete',
      name: 'Excluir Famílias',
      description: 'Permite excluir famílias',
      category: 'Famílias',
    },
    
    // Permissões de Configurações
    {
      id: 'settings.view',
      name: 'Visualizar Configurações',
      description: 'Permite visualizar as configurações do sistema',
      category: 'Configurações',
    },
    {
      id: 'settings.edit',
      name: 'Editar Configurações',
      description: 'Permite editar as configurações do sistema',
      category: 'Configurações',
    },
    
    // Permissões de Relatórios
    {
      id: 'reports.view',
      name: 'Visualizar Relatórios',
      description: 'Permite visualizar relatórios',
      category: 'Relatórios',
    },
    {
      id: 'reports.export',
      name: 'Exportar Relatórios',
      description: 'Permite exportar relatórios',
      category: 'Relatórios',
    },
  ];

  // Agrupar permissões por categoria
  const permissionsByCategory: Record<string, Permission[]> = availablePermissions.reduce(
    (acc, permission) => {
      if (!acc[permission.category]) {
        acc[permission.category] = [];
      }
      acc[permission.category].push(permission);
      return acc;
    },
    {} as Record<string, Permission[]>
  );

  // Função para alternar a seleção de uma permissão
  const togglePermission = (permissionId: string) => {
    setSelectedPermissions((prev) => {
      if (prev.includes(permissionId)) {
        return prev.filter((id) => id !== permissionId);
      } else {
        return [...prev, permissionId];
      }
    });
  };

  // Função para selecionar todas as permissões de uma categoria
  const selectAllInCategory = (category: string) => {
    const categoryPermissionIds = permissionsByCategory[category].map((p) => p.id);
    setSelectedPermissions((prev) => {
      const newPermissions = [...prev];
      categoryPermissionIds.forEach((id) => {
        if (!newPermissions.includes(id)) {
          newPermissions.push(id);
        }
      });
      return newPermissions;
    });
  };

  // Função para desselecionar todas as permissões de uma categoria
  const deselectAllInCategory = (category: string) => {
    const categoryPermissionIds = permissionsByCategory[category].map((p) => p.id);
    setSelectedPermissions((prev) => 
      prev.filter((id) => !categoryPermissionIds.includes(id))
    );
  };

  // Verificar se todas as permissões de uma categoria estão selecionadas
  const isAllCategorySelected = (category: string) => {
    const categoryPermissionIds = permissionsByCategory[category].map((p) => p.id);
    return categoryPermissionIds.every((id) => selectedPermissions.includes(id));
  };

  // Verificar se algumas permissões de uma categoria estão selecionadas
  const isSomeCategorySelected = (category: string) => {
    const categoryPermissionIds = permissionsByCategory[category].map((p) => p.id);
    return categoryPermissionIds.some((id) => selectedPermissions.includes(id)) && 
           !isAllCategorySelected(category);
  };

  // Função para salvar as permissões
  const handleSave = () => {
    onSave(selectedPermissions);
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciar Permissões</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Usuário</p>
            <p className="text-base font-medium">{userName}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Função</p>
            <p className="text-base">{renderRoleBadge(userRole)}</p>
          </div>
        </div>

        <div className="space-y-4">
          {Object.entries(permissionsByCategory).map(([category, permissions]) => (
            <div key={category} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium">{category}</h3>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => selectAllInCategory(category)}
                    disabled={isAllCategorySelected(category)}
                  >
                    Selecionar Todos
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deselectAllInCategory(category)}
                    disabled={!isAllCategorySelected(category) && !isSomeCategorySelected(category)}
                  >
                    Desselecionar Todos
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {permissions.map((permission) => (
                  <div
                    key={permission.id}
                    className="flex items-start space-x-2 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <input
                      type="checkbox"
                      id={permission.id}
                      checked={selectedPermissions.includes(permission.id)}
                      onChange={() => togglePermission(permission.id)}
                      className="mt-1"
                    />
                    <div>
                      <label
                        htmlFor={permission.id}
                        className="block text-sm font-medium cursor-pointer"
                      >
                        {permission.name}
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {permission.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Salvar Permissões
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RoleAssignment;