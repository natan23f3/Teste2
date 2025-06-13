import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Register = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [funcao, setFuncao] = useState('membro'); // Valor padrão
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { register, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      await register(nome, email, senha, funcao);
      
      // Redirecionar para a página de login após o registro bem-sucedido
      navigate('/login');
    } catch (error) {
      console.error('Erro durante o registro:', error);
      // O erro já está sendo tratado no contexto de autenticação
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">Registro</h1>
        <form onSubmit={handleSubmit}>
          {error && <div className="text-red-500 mb-2">{error}</div>}
          <div className="mb-4">
            <label htmlFor="nome" className="block text-gray-700 text-sm font-bold mb-2">Nome:</label>
            <input
              type="text"
              id="nome"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="senha" className="block text-gray-700 text-sm font-bold mb-2">Senha:</label>
            <input
              type="password"
              id="senha"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="funcao" className="block text-gray-700 text-sm font-bold mb-2">Função:</label>
            <select
              id="funcao"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={funcao}
              onChange={(e) => setFuncao(e.target.value)}
              disabled={isSubmitting}
            >
              <option value="administrador">Administrador</option>
              <option value="familiar">Familiar</option>
              <option value="membro">Membro</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registrando...' : 'Registrar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;