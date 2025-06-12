import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardFooter 
} from '../../UI/Card';
import { Button } from '../../UI/Button';
import { Alert } from '../../UI/Alert';
import { Badge } from '../../UI/Badge';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'finances' | 'members' | 'reports' | 'settings';
  enabled: boolean;
}

interface PermissionSettingsProps {
  memberId: number;
  memberName?: string;
  onSave: (memberId: number, permissions: string[]) => Promise<void>;
  onCancel: () => void;
}

const PermissionSettings: React.FC<PermissionSettingsProps> = ({
  memberId,
  memberName = 'Membro',
  onSave,
  onCancel
}) => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Carregar permissões do membro
  useEffect(() => {
    const loadPermissions = async () => {
      setIsLoading(true);
      try {
        // Em produção, aqui faria uma chamada à API
        // Simulando dados para exemplo
        const permissionsData: Permission[] = [
          {
            id: 'view_expenses',
            name: 'Visualizar Despesas',
            description: 'Permite visualizar todas as despesas da família',
            category: 'finances',
            enabled: true
          },
          {
            id: 'create_expenses',
            name: 'Criar Despesas',
            description: 'Permite adicionar novas despesas',
            category: 'finances',
            enabled: true
          },
          {
            id: 'edit_expenses',
            name: 'Editar Despesas',
            description: 'Permite editar despesas existentes',
            category: 'finances',
            enabled: false
          },
          {
            id: 'delete_expenses',
            name: 'Excluir Despesas',
            description: 'Permite excluir despesas',
            category: 'finances',
            enabled: false
          },
          {
            id: 'view_budgets',
            name: 'Visualizar Orçamentos',
            description: 'Permite visualizar orçamentos da família',
            category: 'finances',
            enabled: true
          },
          {
            id: 'edit_budgets',
            name: 'Editar Orçamentos',
            description: 'Permite criar e editar orçamentos',
            category: 'finances',
            enabled: false
          },
          {
            id: 'view_members',
            name: 'Visualizar Membros',
            description: 'Permite visualizar membros da família',
            category: 'members',
            enabled: true
          },
          {
            id: 'invite_members',
            name: 'Convidar Membros',
            description: 'Permite convidar novos membros para a família',
            category: 'members',
            enabled: false
          },
          {
            id: 'manage_members',
            name: 'Gerenciar Membros',
            description: 'Permite gerenciar membros existentes',
            category: 'members',
            enabled: false
          },
          {
            id: 'view_reports',
            name: 'Visualizar Relatórios',
            description: 'Permite visualizar relatórios financeiros',
            category: 'reports',
            enabled: true
          },
          {
            id: 'export_reports',
            name: 'Exportar Relatórios',
            description: 'Permite exportar relatórios',
            category: 'reports',
            enabled: false
          },
          {
            id: 'view_settings',
            name: 'Visualizar Configurações',
            description: 'Permite visualizar configurações da família',
            category: 'settings',
            enabled: true
          },
          {
            id: 'edit_settings',
            name: 'Editar Configurações',
            description: 'Permite editar configurações da família',
            category: 'settings',
            enabled: false
          }
        ];
        
        // Simular um atraso de rede
        setTimeout(() => {
          setPermissions(permissionsData);
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        setError('Erro ao carregar permissões');
        setIsLoading(false);
        console.error(err);
      }
    };

    loadPermissions();
  }, [memberId]);

  // Agrupar permissões por categoria
  const permissionsByCategory = permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  // Alternar permissão
  const togglePermission = (permissionId: string) => {
    setPermissions(prev => 
      prev.map(permission => 
        permission.id === permissionId 
          ? { ...permission, enabled: !permission.enabled } 
          : permission
      )
    );
  };

  // Alternar todas as permissões de uma categoria
  const toggleCategoryPermissions = (category: string, enabled: boolean) => {
    setPermissions(prev => 
      prev.map(permission => 
        permission.category === category 
          ? { ...permission, enabled } 
          : permission
      )
    );
  };

  // Salvar permissões
  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const enabledPermissionIds = permissions
        .filter(p => p.enabled)
        .map(p => p.id);
      
      await onSave(memberId, enabledPermissionIds);
      setSuccess('Permissões salvas com sucesso');
      
      // Limpar a mensagem de sucesso após 3 segundos
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Erro ao salvar permissões');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  // Renderizar categoria de permissões
  const renderPermissionCategory = (category: string, permissions: Permission[]) => {
    const categoryLabels: Record<string, string> = {
      finances: 'Finanças',
      members: 'Membros',
      reports: 'Relatórios',
      settings: 'Configurações'
    };

    const allEnabled = permissions.every(p => p.enabled);
    const allDisabled = permissions.every(p => !p.enabled);

    return (
      <div key={category} className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium">{categoryLabels[category] || category}</h3>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="xs"
              onClick={() => toggleCategoryPermissions(category, true)}
              disabled={allEnabled}
            >
              Selecionar Todos
            </Button>
            <Button 
              variant="outline" 
              size="xs"
              onClick={() => toggleCategoryPermissions(category, false)}
              disabled={allDisabled}
            >
              Desmarcar Todos
            </Button>
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          {permissions.map(permission => (
            <div 
              key={permission.id} 
              className="flex items-start justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-0"
            >
              <div className="flex-1">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={permission.id}
                    checked={permission.enabled}
                    onChange={() => togglePermission(permission.id)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor={permission.id} className="ml-2 text-sm font-medium">
                    {permission.name}
                  </label>
                </div>
                <p className="ml-6 text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {permission.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Permissões para {memberName}</CardTitle>
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
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Configure as permissões específicas para este membro da família. 
                As permissões determinam quais ações o membro pode realizar no sistema.
              </p>
            </div>
            
            {Object.entries(permissionsByCategory).map(([category, perms]) => 
              renderPermissionCategory(category, perms)
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button 
          onClick={handleSave} 
          isLoading={isSaving}
          disabled={isLoading}
        >
          Salvar Permissões
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PermissionSettings;