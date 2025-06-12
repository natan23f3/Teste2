import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../UI/Card';
import { Input } from '../../UI/Input';
import { Select } from '../../UI/Select';
import { Button } from '../../UI/Button';
import { DatePicker } from '../../UI/DatePicker';

/**
 * Interface para os dados de cliente
 */
interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'pending';
  subscriptionPlan: string;
}

/**
 * Interface para as props do componente
 */
interface CustomerFormProps {
  initialData?: CustomerFormData;
  onSubmit: (data: CustomerFormData) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

/**
 * Componente de formulário para criação e edição de clientes
 */
const CustomerForm: React.FC<CustomerFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isEditing = false,
}) => {
  // Estado para os dados do formulário
  const [formData, setFormData] = useState<CustomerFormData>(
    initialData || {
      name: '',
      email: '',
      phone: '',
      status: 'active',
      subscriptionPlan: 'basic',
    }
  );

  // Estado para erros de validação
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Opções para o campo de status
  const statusOptions = [
    { value: 'active', label: 'Ativo' },
    { value: 'inactive', label: 'Inativo' },
    { value: 'pending', label: 'Pendente' },
  ];

  // Opções para o campo de plano de assinatura
  const planOptions = [
    { value: 'basic', label: 'Básico' },
    { value: 'standard', label: 'Padrão' },
    { value: 'premium', label: 'Premium' },
    { value: 'enterprise', label: 'Empresarial' },
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

    // Validar telefone
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Função para enviar o formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Editar Cliente' : 'Novo Cliente'}</CardTitle>
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
              />
              {errors.name && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.name}</p>
              )}
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
              />
              {errors.email && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Telefone */}
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Telefone
              </label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                errorMessage={errors.phone}
              />
              {errors.phone && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.phone}</p>
              )}
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

            {/* Plano de Assinatura */}
            <div className="space-y-2">
              <label htmlFor="subscriptionPlan" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Plano de Assinatura
              </label>
              <Select
                id="subscriptionPlan"
                name="subscriptionPlan"
                value={formData.subscriptionPlan}
                onChange={handleChange}
                options={planOptions}
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

export default CustomerForm;