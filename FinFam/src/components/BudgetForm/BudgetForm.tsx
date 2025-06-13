import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '../UI/Card';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';
import { DatePicker } from '../UI/DatePicker';
import { useBudget } from '../../hooks/useBudget';
import { Budget, CreateBudgetData, UpdateBudgetData } from '../../services/budgetService';
import CategorySelector from './CategorySelector';

/**
 * @component BudgetForm
 * @description Componente para criação e edição de orçamentos familiares.
 * Este componente fornece um formulário completo para gerenciar orçamentos,
 * incluindo validação de campos, feedback visual e integração com a API.
 * 
 * @example
 * // Criar um novo orçamento
 * <BudgetForm onSuccess={handleSuccess} onCancel={handleCancel} />
 * 
 * // Editar um orçamento existente
 * <BudgetForm budget={budgetData} onSuccess={handleSuccess} onCancel={handleCancel} />
 */
interface BudgetFormProps {
  /** Dados do orçamento para edição (opcional). Se não fornecido, o formulário será para criação */
  budget?: Budget;
  /** Função de callback chamada após salvar com sucesso */
  onSuccess?: () => void;
  /** Função de callback chamada quando o usuário cancela a operação */
  onCancel?: () => void;
}

/**
 * Formulário de criação e edição de orçamentos
 * 
 * Este componente permite aos usuários criar novos orçamentos ou editar orçamentos existentes.
 * Inclui validação de campos, feedback de erros e integração com o backend.
 * 
 * @param {Budget} [props.budget] - Orçamento existente para edição (opcional)
 * @param {Function} [props.onSuccess] - Callback executado após salvar com sucesso
 * @param {Function} [props.onCancel] - Callback executado quando o usuário cancela
 */
const BudgetForm: React.FC<BudgetFormProps> = ({
  budget,
  onSuccess,
  onCancel
}) => {
  const { createBudget, updateBudget, isCreating, isUpdating, createError, updateError } = useBudget();
  
  // Estado do formulário
  const [category, setCategory] = useState('');
  const [value, setValue] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Preenche o formulário com os dados do orçamento existente quando em modo de edição
   */
  useEffect(() => {
    if (budget) {
      setCategory(budget.category);
      setValue(budget.value.toString());
      setDate(new Date(budget.date));
    }
  }, [budget]);

  /**
   * Valida os campos do formulário
   * 
   * @returns {boolean} true se o formulário é válido, false caso contrário
   */
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

  /**
   * Manipula o envio do formulário
   * 
   * Valida os campos, cria ou atualiza o orçamento no backend,
   * e executa o callback de sucesso se fornecido.
   * 
   * @param {React.FormEvent} e - Evento de submit do formulário
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const budgetData = {
        category,
        value: parseFloat(value),
        date: date.toISOString()
      };
      
      if (budget) {
        // Atualizar orçamento existente
        await updateBudget(budget.id, budgetData as UpdateBudgetData);
      } else {
        // Criar novo orçamento
        await createBudget(budgetData as CreateBudgetData);
      }
      
      // Limpar formulário após sucesso
      if (!budget) {
        setCategory('');
        setValue('');
        setDate(new Date());
      }
      
      // Chamar callback de sucesso
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Erro ao salvar orçamento:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <h2 className="text-xl font-semibold">
          {budget ? 'Editar Orçamento' : 'Novo Orçamento'}
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
          
          {/* Erros da API */}
          {(createError || updateError) && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">
                Ocorreu um erro ao salvar o orçamento. Por favor, tente novamente.
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
            {budget ? 'Atualizar' : 'Criar'} Orçamento
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default BudgetForm;