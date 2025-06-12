import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../UI/Card';
import { Input } from '../../UI/Input';
import { Select } from '../../UI/Select';
import { Button } from '../../UI/Button';

/**
 * Interface para os dados de usuário
 */
interface UserFormData {
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
  password?: string;
  confirmPassword?: string;
}

/**
 * Interface para as props do componente
 */
interface UserFormProps {
  initialData?: UserFormData;
  onSubmit: (data: UserFormData) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

/**
 * Componente de formulário para criação e edição de usuários
 */
const UserForm: React.FC<UserFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isEditing = false,
}) => {
  // Estado para os dados do formulário
  const [formData, setFormData] = useState<UserFormData>(
    initialData || {
      name: '',
      email: '',
      role: 'user',
      status: 'active',
      password: '',
      confirmPassword: '',
    }
  );

  // Estado para erros de validação
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Opções para o campo de função
  const roleOptions = [
    { value: 'admin', label: 'Administrador' },
    { value: 'manager', label: 'Gerente' },
    { value: 'support', label: 'Suporte' },
    { value: 'user', label: 'Usuário' },
  ];

  // Opções para o campo de status
  const statusOptions = [
    { value: 'active', label: 'Ativo' },
    { value: 'inactive', label: 'Inativo' },
    { value: 'suspended', label: 'Suspenso' },
  ];

  // Função para atualizar os dados do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpar erro do campo quando ele for alterado
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Função para validar o formulário
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validar nome
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Validar senha apenas se não estiver editando ou se a senha foi preenchida
    if (!isEditing || (formData.password && formData.password.trim() !== '')) {
      if (!isEditing && !formData.password) {
        newErrors.password = 'Senha é obrigatória';
      } else if (formData.password && formData.password.length < 8) {
        newErrors.password = 'A senha deve ter pelo menos 8 caracteres';
      }

      if (!isEditing && !formData.confirmPassword) {
        newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'As senhas não coincidem';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Função para enviar o formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // Se estiver editando e a senha estiver vazia, remova os campos de senha
      if (isEditing && !formData.password) {
        const { password, confirmPassword, ...dataWithoutPassword } = formData;
        onSubmit(dataWithoutPassword);
      } else {
        onSubmit(formData);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Editar Usuário' : 'Novo Usuário'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nome */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nome
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                errorMessage={errors.name}
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                errorMessage={errors.email}
                required
              />
            </div>

            {/* Função */}
            <div className="space-y-2">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Função
              </label>
              <Select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                options={roleOptions}
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
              </label>
              <Select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                options={statusOptions}
              />
            </div>

            {/* Senha */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Senha {isEditing && <span className="text-gray-500">(deixe em branco para manter a atual)</span>}
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password || ''}
                onChange={handleChange}
                errorMessage={errors.password}
                isPassword
                required={!isEditing}
              />
            </div>

            {/* Confirmação de Senha */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirmar Senha
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword || ''}
                onChange={handleChange}
                errorMessage={errors.confirmPassword}
                isPassword
                required={!isEditing}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            {isEditing ? 'Atualizar' : 'Criar'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default UserForm;