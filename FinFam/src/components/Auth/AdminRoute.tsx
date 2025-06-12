import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface AdminRouteProps {
  redirectPath?: string;
  children?: React.ReactNode;
}

/**
 * Componente para proteger rotas que requerem privilégios de administrador
 * 
 * Redireciona para a página especificada se o usuário não for administrador
 */
const AdminRoute: React.FC<AdminRouteProps> = ({
  redirectPath = '/login',
  children,
}) => {
  const { user, isAuthenticated, loading } = useAuth();

  // Enquanto verifica a autenticação, pode mostrar um indicador de carregamento
  if (loading) {
    return <div>Carregando...</div>;
  }
  
  // Se não estiver autenticado ou não for administrador, redireciona
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to={redirectPath} replace />;
  }

  // Renderiza o children ou o Outlet (para uso com rotas aninhadas)
  return children ? <>{children}</> : <Outlet />;
};

export default AdminRoute;