import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '../UI/Card';
import { Input } from '../UI/Input';
import { Select } from '../UI/Select';
import { Button } from '../UI/Button';
import { DatePicker } from '../UI/DatePicker';

// Definição da interface Goal
export interface Goal {
  id: number;
  name: string;
  target: number;
  current: number;
  deadline: string;
  category: string;
  priority: 'Baixa' | 'Média' | 'Alta';
  description?: string;
}

interface GoalFormProps {
  goal?: Goal;
  onSuccess: (goal: Omit<Goal, 'id'>) => void;
  onCancel?: () => void;
}

const GoalForm: React.FC<GoalFormProps> = ({
  goal,
  onSuccess,
  onCancel
}) => {
  // Estado do formulário
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [current, setCurrent] = useState('');
  const [deadline, setDeadline] = useState<Date>(new Date());
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState<'Baixa' | 'Média' | 'Alta'>('Média');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Categorias predefinidas para metas
  const goalCategories = [
    'Poupança',
    'Investimento',
    'Educação',
    'Moradia',
    'Transporte',
    'Viagem',
    'Saúde',
    'Aposentadoria',
    'Outros'
  ];

  // Preencher o formulário se estiver editando uma meta existente
  useEffect(() => {
    if (goal) {
      setName(goal.name);
      setTarget(goal.target.toString());
      setCurrent(goal.current.toString());
      setDeadline(new Date(goal.deadline));
      setCategory(goal.category);
      setPriority(goal.priority);
      setDescription(goal.description || '');
    }
  }, [goal]);

  // Validar o formulário
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'Nome da meta é obrigatório';
    }
    
    if (!target.trim()) {
      newErrors.target = 'Valor alvo é obrigatório';
    } else if (isNaN(parseFloat(target)) || parseFloat(target) <= 0) {
      newErrors.target = 'Valor alvo deve ser um número positivo';
    }
    
    if (!current.trim()) {
      newErrors.current = 'Valor atual é obrigatório';
    } else if (isNaN(parseFloat(current)) || parseFloat(current) < 0) {
      newErrors.current = 'Valor atual deve ser um número positivo';
    } else if (parseFloat(current) > parseFloat(target)) {
      newErrors.current = 'Valor atual não pode ser maior que o valor alvo';
    }
    
    if (!deadline) {
      newErrors.deadline = 'Prazo é obrigatório';
    } else if (deadline < new Date()) {
      newErrors.deadline = 'Prazo deve ser uma data futura';
    }
    
    if (!category.trim()) {
      newErrors.category = 'Categoria é obrigatória';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manipular envio do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const goalData = {
        name,
        target: parseFloat(target),
        current: parseFloat(current),
        deadline: deadline.toISOString(),
        category,
        priority,
        description: description.trim() || undefined
      };
      
      onSuccess(goalData);
      
      // Limpar formulário após sucesso se for uma nova meta
      if (!goal) {
        setName('');
        setTarget('');
        setCurrent('');
        setDeadline(new Date());
        setCategory('');
        setPriority('Média');
        setDescription('');
      }
    } catch (error) {
      console.error('Erro ao salvar meta:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <h2 className="text-xl font-semibold">
          {goal ? 'Editar Meta' : 'Nova Meta'}
        </h2>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {/* Nome da Meta */}
          <div>
            <Input
              label="Nome da Meta"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Fundo de Emergência"
              required
              errorMessage={errors.name}
            />
          </div>
          
          {/* Valor Alvo */}
          <div>
            <Input
              label="Valor Alvo (R$)"
              type="number"
              min="0.01"
              step="0.01"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="0,00"
              required
              errorMessage={errors.target}
            />
          </div>
          
          {/* Valor Atual */}
          <div>
            <Input
              label="Valor Atual (R$)"
              type="number"
              min="0"
              step="0.01"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              placeholder="0,00"
              required
              errorMessage={errors.current}
            />
          </div>
          
          {/* Prazo */}
          <div>
            <DatePicker
              label="Prazo"
              selected={deadline}
              onChange={(date) => setDeadline(date || new Date())}
              dateFormat="dd/MM/yyyy"
              minDate={new Date()}
              required
            />
            {errors.deadline && (
              <p className="text-sm text-red-600 mt-1">{errors.deadline}</p>
            )}
          </div>
          
          {/* Categoria */}
          <div>
            <Select
              label="Categoria"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={[
                { value: '', label: 'Selecione uma categoria', disabled: true },
                ...goalCategories.map(cat => ({ value: cat, label: cat }))
              ]}
              required
              errorMessage={errors.category}
            />
          </div>
          
          {/* Prioridade */}
          <div>
            <Select
              label="Prioridade"
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'Baixa' | 'Média' | 'Alta')}
              options={[
                { value: 'Baixa', label: 'Baixa' },
                { value: 'Média', label: 'Média' },
                { value: 'Alta', label: 'Alta' }
              ]}
              required
            />
          </div>
          
          {/* Descrição (opcional) */}
          <div>
            <Input
              label="Descrição (opcional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Adicione detalhes sobre esta meta"
            />
          </div>
          
          {/* Progresso Calculado */}
          {target && current && parseFloat(target) > 0 && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Progresso Atual
              </p>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                  <div 
                    className="h-2.5 rounded-full bg-blue-600" 
                    style={{ 
                      width: `${Math.min((parseFloat(current) / parseFloat(target)) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
                <span className="text-sm">
                  {((parseFloat(current) / parseFloat(target)) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-end space-x-2">
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
            >
              Cancelar
            </Button>
          )}
          <Button 
            type="submit" 
            disabled={isSubmitting}
            isLoading={isSubmitting}
          >
            {goal ? 'Atualizar' : 'Criar'} Meta
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default GoalForm;