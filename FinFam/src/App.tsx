import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { FamilyProvider } from './contexts/FamilyContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import MarketingPage from './pages/MarketingPage';
import EnterpriseDashboard from './pages/EnterpriseDashboard';
import FamilyDashboard from './pages/FamilyDashboard';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

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
              </Route>
            </Routes>
          </BrowserRouter>
        </FamilyProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;