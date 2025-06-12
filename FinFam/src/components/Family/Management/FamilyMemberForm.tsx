import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardFooter 
} from '../../UI/Card';
import { Input } from '../../UI/Input';
import { Select } from '../../UI/Select';
import { Button } from '../../UI/Button';
import { Alert } from '../../UI/Alert';

interface FamilyMember {
  id?: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'pending' | 'inactive';
  phone?: string;
}

interface FamilyMemberFormProps {
  memberId?: number;
  onSave: (member: FamilyMember) => Promise<void>;
  onCancel: () => void;
}

const FamilyMemberForm: React.FC<FamilyMemberFormProps> = ({
  memberId,
  onSave,
  onCancel
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Estado do formulário
  const [formData, setFormData] = useState<FamilyMember>({
    name: '',
    email: '',
    role: 'Membro',
    status: 'active',
    phone: ''
  });

  // Opções para os selects
  const roleOptions = [
    { value: 'Administrador', label: 'Administrador' },
    { value: 'Membro', label: 'Membro' },
    { value: 'Convidado', label: 'Convidado' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Ativo' },
    { value: 'pending', label: 'Pendente' },
    { value: 'inactive', label: 'Inativo' }
  ];

  // Efeito para carregar dados do membro se estiver editando
  useEffect(() => {
    const loadMemberData = async () => {
      if (memberId) {
        setIsLoading(true);
        try {
          // Em produção, aqui faria uma chamada à API
          // Simulando dados para exemplo
          const memberData: FamilyMember = {
            id: memberId,
            name: 'João Silva',
            email: 'joao@example.com',
            role: 'Administrador',
            status: 'active',
            phone: '(11) 98765-4321'
          };
          
          setFormData(memberData);
        } catch (err) {
          setError('Erro ao carregar dados do membro');
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadMemberData();
  }, [memberId]);

  // Handler para mudanças nos campos do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handler para submissão do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Validação básica
      if (!formData.name.trim() || !formData.email.trim()) {
        throw new Error('Nome e email são obrigatórios');
      }

      // Validação de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Email inválido');
      }

      await onSave(formData);
      setSuccess('Membro salvo com sucesso!');
      
      // Se for um novo membro, limpa o formulário
      if (!memberId) {
        setFormData({
          name: '',
          email: '',
          role: 'Membro',
          status: 'active',
          phone: ''
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar membro');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{memberId ? 'Editar Membro' : 'Adicionar Novo Membro'}</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert variant="success" className="mb-4">
            {success}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Nome
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nome completo"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@exemplo.com"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">
              Telefone
            </label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
              placeholder="(00) 00000-0000"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="role" className="text-sm font-medium">
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
          
          {memberId && (
            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">
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
          )}
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          isLoading={isLoading}
        >
          {memberId ? 'Atualizar' : 'Adicionar'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FamilyMemberForm;