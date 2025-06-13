import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AppLayout from '../components/Layout/AppLayout';
import { AppSection } from '../components/Layout/AppLayout';
import { Button } from '../components/UI/Button';
import { Card, CardContent } from '../components/UI/Card';
import { Tabs } from '../components/UI/Tabs';
import UserSettings from '../components/Profile/UserSettings';
import { useToast } from '../components/UI/Toast';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('general');

  // Função para lidar com o logout
  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logout realizado com sucesso');
      navigate('/login');
    } catch (error) {
      toast.error('Erro ao fazer logout');
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Verifica se o usuário está autenticado
  if (!user) {
    return (
      <AppLayout
        title="Perfil"
        description="Gerencie suas informações pessoais e configurações"
      >
        <AppSection>
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Você precisa estar logado para acessar esta página.
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/login')}
            >
              Fazer login
            </Button>
          </div>
        </AppSection>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title="Perfil"
      description="Gerencie suas informações pessoais e configurações"
      headerActions={
        <Button
          variant="outline"
          onClick={handleLogout}
          leftIcon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-5-5H3zm7 5a1 1 0 10-2 0v4.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L12 12.586V8z" clipRule="evenodd" />
            </svg>
          }
        >
          Sair
        </Button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Coluna lateral com informações do usuário */}
        <div className="md:col-span-1">
          <Card className="mb-6">
            <CardContent>
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                  <span className="text-3xl font-bold text-blue-600 dark:text-blue-300">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  {user.name}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-3">{user.email}</p>
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {user.role === 'admin' ? 'Administrador' : 'Usuário'}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <nav className="space-y-1">
                <button
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === 'general'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setActiveTab('general')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                  Geral
                </button>
                <button
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === 'security'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setActiveTab('security')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Segurança
                </button>
                <button
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === 'notifications'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setActiveTab('notifications')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                  </svg>
                  Notificações
                </button>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Conteúdo principal */}
        <div className="md:col-span-2">
          <Card>
            <CardContent>
              {activeTab === 'general' && (
                <UserSettings user={user} />
              )}
              {activeTab === 'security' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Segurança da conta
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Alterar senha
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Recomendamos usar uma senha forte que você não use em nenhum outro site.
                      </p>
                      <Button variant="outline">Alterar senha</Button>
                    </div>
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Autenticação de dois fatores
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Adicione uma camada extra de segurança à sua conta.
                      </p>
                      <Button variant="outline">Configurar 2FA</Button>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'notifications' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Preferências de notificação
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="email-notifications"
                          name="email-notifications"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          defaultChecked
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="email-notifications" className="font-medium text-gray-700 dark:text-gray-300">
                          Notificações por e-mail
                        </label>
                        <p className="text-gray-500 dark:text-gray-400">
                          Receba atualizações sobre atividades da sua conta por e-mail.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="budget-alerts"
                          name="budget-alerts"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          defaultChecked
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="budget-alerts" className="font-medium text-gray-700 dark:text-gray-300">
                          Alertas de orçamento
                        </label>
                        <p className="text-gray-500 dark:text-gray-400">
                          Receba alertas quando você estiver próximo de atingir seus limites de orçamento.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="family-updates"
                          name="family-updates"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          defaultChecked
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="family-updates" className="font-medium text-gray-700 dark:text-gray-300">
                          Atualizações da família
                        </label>
                        <p className="text-gray-500 dark:text-gray-400">
                          Receba notificações sobre atividades dos membros da sua família.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Button variant="primary">Salvar preferências</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProfilePage;