import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';
import { User } from '../types/user';

// Interface para o contexto de autenticação
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, senha: string) => Promise<void>;
  register: (nome: string, email: string, senha: string, funcao?: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Valor padrão do contexto
const defaultAuthContext: AuthContextType = {
  user: null,
  loading: true,
  error: null,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
};

// Criação do contexto
export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

// Props para o provedor de contexto
interface AuthProviderProps {
  children: ReactNode;
}

// Componente provedor de contexto
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Verifica se o usuário está autenticado ao carregar o componente
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const userData = await authService.getCurrentUser();
        setUser(userData);
        setError(null);
      } catch (err) {
        setError('Erro ao verificar autenticação');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Função para fazer login
  const login = async (email: string, senha: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login({ email, senha });
      setUser(response.user);
    } catch (err) {
      setError('Falha no login. Verifique suas credenciais.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Função para registrar um novo usuário
  const register = async (nome: string, email: string, senha: string, funcao?: string) => {
    try {
      setLoading(true);
      setError(null);
      await authService.register({ nome, email, senha, funcao });
    } catch (err) {
      setError('Falha no registro. Tente novamente.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Função para fazer logout
  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      await authService.logout();
      setUser(null);
    } catch (err) {
      setError('Erro ao fazer logout');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Valor do contexto
  const value: AuthContextType = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};