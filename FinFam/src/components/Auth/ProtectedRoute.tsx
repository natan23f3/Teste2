import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  redirectPath?: string;
  children?: React.ReactNode;
}

/**
 * Componente para proteger rotas que requerem autenticação
 * 
 * Redireciona para a página de login se o usuário não estiver autenticado
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  redirectPath = '/login',
  children,
}) => {
  const { isAuthenticated, loading } = useAuth();

  // Enquanto verifica a autenticação, pode mostrar um indicador de carregamento
  if (loading) {
    return <div>Carregando...</div>;
  }
  
  // Se não estiver autenticado, redireciona para o caminho especificado
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  // Renderiza o children ou o Outlet (para uso com rotas aninhadas)
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;