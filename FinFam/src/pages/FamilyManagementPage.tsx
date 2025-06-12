import React, { useState } from 'react';
import { useFamily } from '../hooks/useFamily';
import FamilyMemberList from '../components/Family/Management/FamilyMemberList';
import FamilyMemberDetail from '../components/Family/Management/FamilyMemberDetail';
import FamilyMemberForm from '../components/Family/Management/FamilyMemberForm';
import InviteMember from '../components/Family/Management/InviteMember';
import { Card, CardHeader, CardTitle, CardContent } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { Alert } from '../components/UI/Alert';

interface FamilyMember {
  id?: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'pending' | 'inactive';
  phone?: string;
}

const FamilyManagementPage: React.FC = () => {
  const { selectedFamily } = useFamily();
  const [activeView, setActiveView] = useState<'list' | 'detail' | 'form'>('list');
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Handler para visualizar detalhes de um membro
  const handleViewDetail = (memberId: number) => {
    setSelectedMemberId(memberId);
    setActiveView('detail');
  };

  // Handler para editar um membro
  const handleEdit = (memberId: number) => {
    setSelectedMemberId(memberId);
    setActiveView('form');
  };

  // Handler para adicionar um novo membro
  const handleAddNew = () => {
    setSelectedMemberId(null);
    setActiveView('form');
  };

  // Handler para voltar à lista
  const handleBackToList = () => {
    setSelectedMemberId(null);
    setActiveView('list');
  };

  // Handler para abrir o modal de convite
  const handleOpenInviteModal = () => {
    setIsInviteModalOpen(true);
  };

  // Handler para fechar o modal de convite
  const handleCloseInviteModal = () => {
    setIsInviteModalOpen(false);
  };

  // Handler para salvar um membro (novo ou editado)
  const handleSaveMember = async (member: FamilyMember) => {
    try {
      // Em produção, aqui faria uma chamada à API
      console.log('Salvando membro:', member);
      
      // Simulando uma operação bem-sucedida
      setSuccess(`Membro ${member.name} salvo com sucesso!`);
      setTimeout(() => {
        setSuccess(null);
        handleBackToList();
      }, 2000);
      
      return Promise.resolve();
    } catch (err) {
      setError('Erro ao salvar membro');
      console.error(err);
      return Promise.reject(err);
    }
  };

  // Handler para sucesso no convite
  const handleInviteSuccess = () => {
    setSuccess('Convite enviado com sucesso!');
    setTimeout(() => setSuccess(null), 3000);
  };

  // Handler para alterar permissões
  const handleChangePermissions = (memberId: number) => {
    console.log('Alterar permissões para o membro:', memberId);
    // Aqui você poderia navegar para a página de controle de acesso
    // ou abrir um modal para editar permissões
  };

  // Renderizar o conteúdo com base na visualização ativa
  const renderContent = () => {
    if (!selectedFamily) {
      return (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">
              Selecione uma família para gerenciar seus membros.
            </p>
          </CardContent>
        </Card>
      );
    }

    switch (activeView) {
      case 'detail':
        return (
          <FamilyMemberDetail
            memberId={selectedMemberId!}
            onEdit={handleEdit}
            onBack={handleBackToList}
            onChangePermissions={handleChangePermissions}
          />
        );
      case 'form':
        return (
          <FamilyMemberForm
            memberId={selectedMemberId || undefined}
            onSave={handleSaveMember}
            onCancel={handleBackToList}
          />
        );
      default:
        return (
          <FamilyMemberList
            onViewDetail={handleViewDetail}
            onEdit={handleEdit}
            onInvite={handleOpenInviteModal}
          />
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Gerenciamento de Família</h1>
          <p className="text-gray-600">
            Gerencie os membros da sua família e suas permissões
          </p>
        </div>
        
        {activeView === 'list' && (
          <Button onClick={handleAddNew}>
            Adicionar Membro
          </Button>
        )}
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
      
      <InviteMember
        isOpen={isInviteModalOpen}
        onClose={handleCloseInviteModal}
        onSuccess={handleInviteSuccess}
      />
    </div>
  );
};

export default FamilyManagementPage;