import { api } from '../utils/api';
import { RegisterUserData, LoginUserData, AuthResponse, User } from '../types/user';

// Classe de serviço de autenticação
class AuthService {
  // Método para registrar um novo usuário
  async register(data: RegisterUserData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  }

  // Método para fazer login
  async login(data: LoginUserData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    
    // Armazena o token no localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data;
  }

  // Método para fazer logout
  async logout(): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/auth/logout');
    
    // Remove o token do localStorage
    localStorage.removeItem('token');
    
    return response.data;
  }

  // Método para verificar se o usuário está autenticado
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  // Método para obter o token JWT
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Método para obter informações do usuário atual
  async getCurrentUser(): Promise<User | null> {
    if (!this.isAuthenticated()) {
      return null;
    }

    try {
      const response = await api.get<{ user: User }>('/auth/me');
      return response.data.user;
    } catch (error) {
      // Se houver um erro, remove o token e retorna null
      localStorage.removeItem('token');
      return null;
    }
  }
}

// Exporta uma instância única do serviço
export const authService = new AuthService();