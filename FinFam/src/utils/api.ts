import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// Criação da instância do Axios
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de requisição para adicionar o token JWT
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem('token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Interceptor de resposta para lidar com erros de autenticação
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    // Se o erro for 401 (Não autorizado), o token pode ter expirado
    if (error.response && error.response.status === 401) {
      // Limpa o token do localStorage
      localStorage.removeItem('token');
      
      // Redireciona para a página de login
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export { api };