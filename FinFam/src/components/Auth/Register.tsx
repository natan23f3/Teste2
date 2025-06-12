import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';

const Register = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [funcao, setFuncao] = useState('membro'); // Valor padrão
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post('/auth/register', { nome, email, senha, funcao });

      // Redirecionar para a página de login
      navigate('/login');
    } catch (error: any) {
      console.error(error);
      alert('Erro ao registrar usuário.');
    }
  };

  return (
    <div>
      <h1>Registro</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nome">Nome:</label>
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="senha">Senha:</label>
          <input
            type="password"
            id="senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="funcao">Função:</label>
          <select
            id="funcao"
            value={funcao}
            onChange={(e) => setFuncao(e.target.value)}
          >
            <option value="administrador">Administrador</option>
            <option value="familiar">Familiar</option>
            <option value="membro">Membro</option>
          </select>
        </div>
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default Register;