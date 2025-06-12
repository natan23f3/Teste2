import { useContext } from 'react';
import { AuthContext, AuthContextType } from '../contexts/AuthContext';

/**
 * Hook personalizado para acessar o contexto de autenticação
 * 
 * Fornece acesso ao estado de autenticação e métodos para login, registro e logout
 * 
 * @returns O contexto de autenticação
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
};