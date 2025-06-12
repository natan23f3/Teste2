import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '../UI/Card';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';
import { DatePicker } from '../UI/DatePicker';
import { useExpense } from '../../hooks/useExpense';
import { Expense, CreateExpenseData, UpdateExpenseData } from '../../services/expenseService';
import CategorySelector from '../BudgetForm/CategorySelector';

// Estendendo a interface Expense para incluir descrição opcional
interface ExtendedExpense extends Expense {
  description?: string;
}

interface ExpenseFormProps {
  expense?: ExtendedExpense;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({
  expense,
  onSuccess,
  onCancel
}) => {
  const { createExpense, updateExpense, isCreating, isUpdating, createError, updateError } = useExpense();
  
  // Estado do formulário
  const [category, setCategory] = useState('');
  const [value, setValue] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Preencher o formulário se estiver editando uma despesa existente
  useEffect(() => {
    if (expense) {
      setCategory(expense.category);
      setValue(expense.value.toString());
      setDate(new Date(expense.date));
      setDescription(expense.description || '');
    }
  }, [expense]);

  // Validar o formulário
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!category.trim()) {
      newErrors.category = 'Categoria é obrigatória';
    }
    
    if (!value.trim()) {
      newErrors.value = 'Valor é obrigatório';
    } else if (isNaN(parseFloat(value)) || parseFloat(value) < 0) {
      newErrors.value = 'Valor deve ser um número positivo';
    }
    
    if (!date) {
      newErrors.date = 'Data é obrigatória';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manipular envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Dados básicos da despesa (sem familyId, que será adicionado pelo hook)
      const expenseData = {
        category,
        value: parseFloat(value),
        date: date.toISOString()
      };
      
      if (expense) {
        // Atualizar despesa existente
        await updateExpense(expense.id, expenseData);
      } else {
        // Criar nova despesa
        await createExpense(expenseData);
      }
      
      // Limpar formulário após sucesso
      if (!expense) {
        setCategory('');
        setValue('');
        setDate(new Date());
        setDescription('');
      }
      
      // Chamar callback de sucesso
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Erro ao salvar despesa:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <h2 className="text-xl font-semibold">
          {expense ? 'Editar Despesa' : 'Nova Despesa'}
        </h2>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {/* Seletor de Categoria */}
          <div>
            <CategorySelector
              value={category}
              onChange={setCategory}
            />
            {errors.category && (
              <p className="text-sm text-red-600 mt-1">{errors.category}</p>
            )}
          </div>
          
          {/* Valor */}
          <div>
            <Input
              label="Valor (R$)"
              type="number"
              min="0"
              step="0.01"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="0,00"
              required
              errorMessage={errors.value}
            />
          </div>
          
          {/* Data */}
          <div>
            <DatePicker
              label="Data"
              selected={date}
              onChange={(date) => setDate(date || new Date())}
              dateFormat="dd/MM/yyyy"
              required
            />
            {errors.date && (
              <p className="text-sm text-red-600 mt-1">{errors.date}</p>
            )}
          </div>
          
          {/* Descrição (opcional) */}
          <div>
            <Input
              label="Descrição (opcional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Adicione detalhes sobre esta despesa"
            />
          </div>
          
          {/* Erros da API */}
          {(createError || updateError) && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">
                Ocorreu um erro ao salvar a despesa. Por favor, tente novamente.
              </p>
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
            disabled={isSubmitting || isCreating || isUpdating}
            isLoading={isSubmitting || isCreating || isUpdating}
          >
            {expense ? 'Atualizar' : 'Registrar'} Despesa
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ExpenseForm;