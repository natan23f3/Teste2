import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/UI/Button';
import { Card, CardContent } from '../components/UI/Card';
import { Tabs, TabList, TabButton, TabPanel } from '../components/UI/Tabs';
import AdminDashboard from '../components/Admin/Dashboard/AdminDashboard';
import CustomerList from '../components/Admin/Customers/CustomerList';
import CustomerDetail from '../components/Admin/Customers/CustomerDetail';
import CustomerForm from '../components/Admin/Customers/CustomerForm';
import UserList from '../components/Admin/Users/UserList';
import UserDetail from '../components/Admin/Users/UserDetail';
import UserForm from '../components/Admin/Users/UserForm';
import RoleAssignment from '../components/Admin/Users/RoleAssignment';

/**
 * Tipos de visualização para cada seção
 */
type DashboardView = 'overview';
type CustomersView = 'list' | 'detail' | 'create' | 'edit';
type UsersView = 'list' | 'detail' | 'create' | 'edit' | 'permissions';

/**
 * Página principal do painel administrativo
 * 
 * Contém navegação por abas para as diferentes seções do painel administrativo
 */
const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Estado para controlar a aba ativa
  const [activeTab, setActiveTab] = useState('dashboard');

  // Estados para controlar as visualizações de cada seção
  const [dashboardView, setDashboardView] = useState<DashboardView>('overview');
  const [customersView, setCustomersView] = useState<CustomersView>('list');
  const [usersView, setUsersView] = useState<UsersView>('list');

  // Estados para armazenar IDs para visualizações de detalhes/edição
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  // Verificar se o usuário é administrador
  const isAdmin = user?.role === 'admin';

  // Redirecionar se o usuário não for administrador
  if (!isAdmin) {
    return (
      <Card className="max-w-md mx-auto mt-10">
        <CardContent className="p-6 text-center">
          <h2 className="text-xl font-bold mb-4">Acesso Restrito</h2>
          <p className="mb-6">
            Você não tem permissão para acessar o painel administrativo.
          </p>
          <Button variant="primary" onClick={() => navigate('/')}>
            Voltar para a Página Inicial
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Função para lidar com a mudança de aba
  const handleTabChange = (id: string) => {
    setActiveTab(id);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Painel Administrativo FinFam
              </h1>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400 mr-4">
                {user?.name}
              </span>
              <Button variant="outline" size="sm" onClick={() => navigate('/')}>
                Voltar ao Site
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs defaultTab="dashboard" onChange={handleTabChange}>
          <TabList>
            <TabButton id="dashboard">Dashboard</TabButton>
            <TabButton id="customers">Clientes</TabButton>
            <TabButton id="users">Usuários</TabButton>
          </TabList>
          
          {/* Painel de Dashboard */}
          <TabPanel id="dashboard">
            <div className="p-6">
              <AdminDashboard />
            </div>
          </TabPanel>
          
          {/* Painel de Clientes */}
          <TabPanel id="customers">
            <div className="p-6">
              {customersView === 'list' && (
                <CustomerList />
              )}
              {customersView === 'detail' && selectedCustomerId && (
                <CustomerDetail
                  customerId={selectedCustomerId}
                  onBack={() => {
                    setCustomersView('list');
                    setSelectedCustomerId(null);
                  }}
                />
              )}
              {customersView === 'create' && (
                <CustomerForm
                  onSubmit={(data) => {
                    // Aqui seria feita a chamada à API para criar o cliente
                    console.log('Criar cliente:', data);
                    setCustomersView('list');
                  }}
                  onCancel={() => {
                    setCustomersView('list');
                  }}
                />
              )}
              {customersView === 'edit' && selectedCustomerId && (
                <CustomerForm
                  isEditing
                  initialData={{
                    name: 'Cliente Exemplo',
                    email: 'cliente@exemplo.com',
                    phone: '(11) 98765-4321',
                    status: 'active',
                    subscriptionPlan: 'premium',
                  }}
                  onSubmit={(data) => {
                    // Aqui seria feita a chamada à API para atualizar o cliente
                    console.log('Atualizar cliente:', data);
                    setCustomersView('detail');
                  }}
                  onCancel={() => {
                    setCustomersView('detail');
                  }}
                />
              )}
            </div>
          </TabPanel>
          
          {/* Painel de Usuários */}
          <TabPanel id="users">
            <div className="p-6">
              {usersView === 'list' && (
                <UserList />
              )}
              {usersView === 'detail' && selectedUserId && (
                <UserDetail
                  userId={selectedUserId}
                  onBack={() => {
                    setUsersView('list');
                    setSelectedUserId(null);
                  }}
                />
              )}
              {usersView === 'create' && (
                <UserForm
                  onSubmit={(data) => {
                    // Aqui seria feita a chamada à API para criar o usuário
                    console.log('Criar usuário:', data);
                    setUsersView('list');
                  }}
                  onCancel={() => {
                    setUsersView('list');
                  }}
                />
              )}
              {usersView === 'edit' && selectedUserId && (
                <UserForm
                  isEditing
                  initialData={{
                    name: 'Usuário Exemplo',
                    email: 'usuario@exemplo.com',
                    role: 'user',
                    status: 'active',
                  }}
                  onSubmit={(data) => {
                    // Aqui seria feita a chamada à API para atualizar o usuário
                    console.log('Atualizar usuário:', data);
                    setUsersView('detail');
                  }}
                  onCancel={() => {
                    setUsersView('detail');
                  }}
                />
              )}
              {usersView === 'permissions' && selectedUserId && (
                <RoleAssignment
                  userId={selectedUserId}
                  userName="Usuário Exemplo"
                  userRole="user"
                  initialPermissions={['users.view', 'customers.view']}
                  onSave={(permissions) => {
                    // Aqui seria feita a chamada à API para atualizar as permissões
                    console.log('Atualizar permissões:', permissions);
                    setUsersView('detail');
                  }}
                  onCancel={() => {
                    setUsersView('detail');
                  }}
                />
              )}
            </div>
          </TabPanel>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboardPage;