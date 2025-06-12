import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { FamilyProvider } from './contexts/FamilyContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import AdminRoute from './components/Auth/AdminRoute';
import MarketingPage from './pages/MarketingPage';
import EnterpriseDashboard from './pages/EnterpriseDashboard';
import FamilyDashboard from './pages/FamilyDashboard';
import AdminDashboardPage from './pages/AdminDashboardPage';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

// Novas páginas do sistema hierárquico
import FamilyManagementPage from './pages/FamilyManagementPage';
import AccessControlPage from './pages/AccessControlPage';
import FamilyMonitoringPage from './pages/FamilyMonitoringPage';

// Novas páginas financeiras
import BudgetPage from './pages/BudgetPage';
import ExpensePage from './pages/ExpensePage';
import GoalsPage from './pages/GoalsPage';

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
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <FamilyProvider>
          <BrowserRouter>
            <Routes>
              {/* Rotas públicas */}
              <Route path="/" element={<MarketingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Rotas protegidas */}
              <Route element={<ProtectedRoute />}>
                <Route path="/enterprise" element={<EnterpriseDashboard />} />
                <Route path="/family" element={<FamilyDashboard />} />
                
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
            </Routes>
          </BrowserRouter>
        </FamilyProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;