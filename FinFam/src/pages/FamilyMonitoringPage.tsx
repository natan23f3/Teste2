import React, { useState } from 'react';
import { useFamily } from '../hooks/useFamily';
import ActivityDashboard from '../components/Family/Monitoring/ActivityDashboard';
import MemberActivity from '../components/Family/Monitoring/MemberActivity';
import BudgetCompliance from '../components/Family/Monitoring/BudgetCompliance';
import ExpenseTracking from '../components/Family/Monitoring/ExpenseTracking';
import { Card, CardContent } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { Alert } from '../components/UI/Alert';

const FamilyMonitoringPage: React.FC = () => {
  const { selectedFamily } = useFamily();
  const [activeView, setActiveView] = useState<'dashboard' | 'member' | 'budget' | 'expense'>('dashboard');
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handler para visualizar detalhes de um membro
  const handleViewMemberDetails = (memberId: number) => {
    setSelectedMemberId(memberId);
    setActiveView('member');
  };

  // Handler para voltar ao dashboard
  const handleBackToDashboard = () => {
    setSelectedMemberId(null);
    setActiveView('dashboard');
  };

  // Renderizar o conteúdo com base na visualização ativa
  const renderContent = () => {
    if (!selectedFamily) {
      return (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">
              Selecione uma família para visualizar o monitoramento.
            </p>
          </CardContent>
        </Card>
      );
    }

    switch (activeView) {
      case 'member':
        return (
          <div>
            <div className="mb-4">
              <Button variant="outline" onClick={handleBackToDashboard}>
                Voltar ao Dashboard
              </Button>
            </div>
            <MemberActivity onViewMemberDetails={handleViewMemberDetails} />
          </div>
        );
      case 'budget':
        return (
          <div>
            <div className="mb-4">
              <Button variant="outline" onClick={handleBackToDashboard}>
                Voltar ao Dashboard
              </Button>
            </div>
            <BudgetCompliance />
          </div>
        );
      case 'expense':
        return (
          <div>
            <div className="mb-4">
              <Button variant="outline" onClick={handleBackToDashboard}>
                Voltar ao Dashboard
              </Button>
            </div>
            <ExpenseTracking />
          </div>
        );
      default:
        return (
          <ActivityDashboard onViewMemberDetails={handleViewMemberDetails} />
        );
    }
  };

  // Função para alternar para uma visualização específica
  const switchToView = (view: 'dashboard' | 'member' | 'budget' | 'expense') => {
    setActiveView(view);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Monitoramento Familiar</h1>
        <p className="text-gray-600">
          Acompanhe atividades, conformidade com orçamento e despesas da família
        </p>
      </div>
      
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}
      
      {activeView === 'dashboard' && (
        <div className="flex flex-wrap gap-2 mb-6">
          <Button 
            variant="outline" 
            onClick={() => switchToView('member')}
          >
            Atividade de Membros
          </Button>
          <Button 
            variant="outline" 
            onClick={() => switchToView('budget')}
          >
            Conformidade com Orçamento
          </Button>
          <Button 
            variant="outline" 
            onClick={() => switchToView('expense')}
          >
            Rastreamento de Despesas
          </Button>
        </div>
      )}
      
      {renderContent()}
    </div>
  );
};

export default FamilyMonitoringPage;