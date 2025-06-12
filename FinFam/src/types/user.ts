/**
 * Interface que representa um usuário no sistema
 */
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

/**
 * Interface para os dados de registro de usuário
 */
export interface RegisterUserData {
  nome: string;
  email: string;
  senha: string;
  funcao?: string;
}

/**
 * Interface para os dados de login de usuário
 */
export interface LoginUserData {
  email: string;
  senha: string;
}

/**
 * Interface para a resposta da API de autenticação
 */
export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}