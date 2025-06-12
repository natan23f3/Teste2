import React, { useState } from 'react';
import { useFamily } from '../../../hooks/useFamily';
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
import { Modal } from '../../UI/Modal';

interface InviteMemberProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const InviteMember: React.FC<InviteMemberProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { selectedFamily, addMember } = useFamily();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Membro');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Opções para o select de função
  const roleOptions = [
    { value: 'Administrador', label: 'Administrador' },
    { value: 'Membro', label: 'Membro' },
    { value: 'Convidado', label: 'Convidado' }
  ];

  // Resetar o estado do formulário
  const resetForm = () => {
    setEmail('');
    setRole('Membro');
    setError(null);
    setSuccess(null);
  };

  // Handler para fechar o modal
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Handler para enviar o convite
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFamily) {
      setError('Nenhuma família selecionada');
      return;
    }

    if (!email.trim()) {
      setError('Email é obrigatório');
      return;
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Email inválido');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await addMember(selectedFamily.id, email);
      setSuccess(`Convite enviado para ${email} com sucesso!`);
      setEmail('');
      
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
          handleClose();
        }, 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar convite');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Convidar Membro">
      <div className="p-4">
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
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@exemplo.com"
              required
            />
            <p className="text-xs text-gray-500">
              Um convite será enviado para este endereço de email
            </p>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="role" className="text-sm font-medium">
              Função
            </label>
            <Select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              options={roleOptions}
            />
            <p className="text-xs text-gray-500">
              Define o nível de acesso que o membro terá na família
            </p>
          </div>
          
          <div className="pt-4 flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              isLoading={isLoading}
            >
              Enviar Convite
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default InviteMember;