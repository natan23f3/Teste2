import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { FamilyProvider } from './contexts/FamilyContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import AdminRoute from './components/Auth/AdminRoute';
import ErrorBoundary from './components/UI/ErrorBoundary';
import { ToastContainer } from './components/UI/Toast';

// Páginas com carregamento lazy
const LandingPage = lazy(() => import('./pages/LandingPage'));
const MarketingPage = lazy(() => import('./pages/MarketingPage'));
const EnterpriseDashboard = lazy(() => import('./pages/EnterpriseDashboard'));
const FamilyDashboard = lazy(() => import('./pages/FamilyDashboard'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
const Login = lazy(() => import('./components/Auth/Login'));
const Register = lazy(() => import('./components/Auth/Register'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const ErrorPage = lazy(() => import('./pages/ErrorPage'));

// Novas páginas do sistema hierárquico
const FamilyManagementPage = lazy(() => import('./pages/FamilyManagementPage'));
const AccessControlPage = lazy(() => import('./pages/AccessControlPage'));
const FamilyMonitoringPage = lazy(() => import('./pages/FamilyMonitoringPage'));

// Novas páginas financeiras
const BudgetPage = lazy(() => import('./pages/BudgetPage'));
const ExpensePage = lazy(() => import('./pages/ExpensePage'));
const GoalsPage = lazy(() => import('./pages/GoalsPage'));

// Componente de carregamento
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Criação do cliente de consulta para o TanStack Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      retry: 1,
    },
  },
});

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <FamilyProvider>
            <BrowserRouter>
              <ToastContainer />
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  {/* Rotas públicas */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/marketing" element={<MarketingPage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/error" element={<ErrorPage />} />
                  
                  {/* Rotas protegidas */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/enterprise" element={<EnterpriseDashboard />} />
                    <Route path="/family" element={<FamilyDashboard />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    
                    {/* Novas rotas do sistema hierárquico */}
                    <Route path="/family/management" element={<FamilyManagementPage />} />
                    <Route path="/family/access" element={<AccessControlPage />} />
                    <Route path="/family/monitoring" element={<FamilyMonitoringPage />} />
                    
                    {/* Novas rotas financeiras */}
                    <Route path="/budgets" element={<BudgetPage />} />
                    <Route path="/expenses" element={<ExpensePage />} />
                    <Route path="/goals" element={<GoalsPage />} />
                  </Route>

                  {/* Rotas administrativas */}
                  <Route element={<AdminRoute />}>
                    <Route path="/admin" element={<AdminDashboardPage />} />
                  </Route>

                  {/* Rota de fallback para páginas não encontradas */}
                  <Route path="*" element={
                    <ErrorPage 
                      title="Página não encontrada" 
                      message="A página que você está procurando não existe ou foi movida."
                    />
                  } />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </FamilyProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;