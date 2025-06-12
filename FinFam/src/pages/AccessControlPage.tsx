import React, { useState } from 'react';
import { useFamily } from '../hooks/useFamily';
import AccessLevelManager from '../components/Family/Access/AccessLevelManager';
import PermissionSettings from '../components/Family/Access/PermissionSettings';
import RoleDefinition from '../components/Family/Access/RoleDefinition';
import { Card, CardHeader, CardTitle, CardContent } from '../components/UI/Card';
import { Alert } from '../components/UI/Alert';

const AccessControlPage: React.FC = () => {
  const { selectedFamily } = useFamily();
  const [activeView, setActiveView] = useState<'access' | 'permissions' | 'roles'>('access');
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Handler para editar permissões de um membro
  const handleEditPermissions = (memberId: number) => {
    setSelectedMemberId(memberId);
    setActiveView('permissions');
  };

  // Handler para editar permissões de uma função
  const handleEditRolePermissions = (roleId: string) => {
    setSelectedRoleId(roleId);
    setActiveView('permissions');
  };

  // Handler para abrir o gerenciador de funções
  const handleOpenRoles = () => {
    setActiveView('roles');
  };

  // Handler para voltar ao gerenciador de acesso
  const handleBackToAccess = () => {
    setSelectedMemberId(null);
    setSelectedRoleId(null);
    setActiveView('access');
  };

  // Handler para salvar permissões
  const handleSavePermissions = async (entityId: number | string, permissions: string[]) => {
    try {
      // Em produção, aqui faria uma chamada à API
      console.log('Salvando permissões:', { entityId, permissions });
      
      // Simulando uma operação bem-sucedida
      setSuccess('Permissões salvas com sucesso!');
      setTimeout(() => {
        setSuccess(null);
        handleBackToAccess();
      }, 2000);
      
      return Promise.resolve();
    } catch (err) {
      setError('Erro ao salvar permissões');
      console.error(err);
      return Promise.reject(err);
    }
  };

  // Renderizar o conteúdo com base na visualização ativa
  const renderContent = () => {
    if (!selectedFamily) {
      return (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">
              Selecione uma família para gerenciar controle de acesso.
            </p>
          </CardContent>
        </Card>
      );
    }

    switch (activeView) {
      case 'permissions':
        if (selectedMemberId) {
          return (
            <PermissionSettings
              memberId={selectedMemberId}
              memberName="João Silva" // Em produção, você buscaria o nome do membro
              onSave={(memberId, permissions) => handleSavePermissions(memberId, permissions)}
              onCancel={handleBackToAccess}
            />
          );
        } else if (selectedRoleId) {
          return (
            <PermissionSettings
              memberId={parseInt(selectedRoleId)} // Usando o mesmo componente para funções
              memberName="Função: Administrador" // Em produção, você buscaria o nome da função
              onSave={(_, permissions) => handleSavePermissions(selectedRoleId, permissions)}
              onCancel={handleBackToAccess}
            />
          );
        }
        return null;
      case 'roles':
        return (
          <RoleDefinition
            onEditRolePermissions={handleEditRolePermissions}
            onClose={handleBackToAccess}
          />
        );
      default:
        return (
          <AccessLevelManager
            onEditPermissions={handleEditPermissions}
            onEditRoles={handleOpenRoles}
          />
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Controle de Acesso</h1>
        <p className="text-gray-600">
          Gerencie níveis de acesso, funções e permissões dos membros da família
        </p>
      </div>
      
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
      
      {renderContent()}
    </div>
  );
};

export default AccessControlPage;