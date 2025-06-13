import React, { useState } from 'react';
import { User } from '../../types/user';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { useToast } from '../UI/Toast';

interface UserSettingsProps {
  user: User;
}

const UserSettings: React.FC<UserSettingsProps> = ({ user }) => {
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Função para lidar com mudanças nos campos do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Todos os campos são obrigatórios');
      return;
    }
    
    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Por favor, insira um email válido');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Simulação de uma chamada de API para atualizar os dados do usuário
      // Em um cenário real, você chamaria um serviço para atualizar os dados
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Atualização bem-sucedida
      toast.success('Perfil atualizado com sucesso');
      setIsEditing(false);
    } catch (error) {
      toast.error('Erro ao atualizar o perfil');
      console.error('Erro ao atualizar o perfil:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para cancelar a edição
  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
    });
    setIsEditing(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Informações pessoais
        </h3>
        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            leftIcon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            }
          >
            Editar
          </Button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nome
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Seu nome completo"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu.email@exemplo.com"
                required
              />
            </div>
          </div>
          <div className="mt-6 flex space-x-3">
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
            >
              Salvar alterações
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancelar
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Nome
            </h4>
            <p className="mt-1 text-sm text-gray-900 dark:text-white">
              {user.name}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Email
            </h4>
            <p className="mt-1 text-sm text-gray-900 dark:text-white">
              {user.email}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Função
            </h4>
            <p className="mt-1 text-sm text-gray-900 dark:text-white">
              {user.role === 'admin' ? 'Administrador' : 'Usuário'}
            </p>
          </div>
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Preferências de conta
        </h3>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="dark-mode"
                name="dark-mode"
                type="checkbox"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="dark-mode" className="font-medium text-gray-700 dark:text-gray-300">
                Modo escuro
              </label>
              <p className="text-gray-500 dark:text-gray-400">
                Ative o modo escuro para reduzir o cansaço visual.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="language"
                name="language"
                type="checkbox"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                defaultChecked
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="language" className="font-medium text-gray-700 dark:text-gray-300">
                Idioma: Português
              </label>
              <p className="text-gray-500 dark:text-gray-400">
                Defina o idioma padrão para a interface do usuário.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <Button variant="outline">Salvar preferências</Button>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;