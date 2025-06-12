import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '../UI/Card';
import { Input } from '../UI/Input';
import { Select } from '../UI/Select';
import { Button } from '../UI/Button';
import { DatePicker } from '../UI/DatePicker';
import CategorySelector from '../BudgetForm/CategorySelector';

export interface ExpenseFilterValues {
  searchTerm: string;
  category: string;
  dateFrom: Date | null;
  dateTo: Date | null;
  minValue: string;
  maxValue: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface ExpenseFilterProps {
  initialValues?: Partial<ExpenseFilterValues>;
  onFilter: (filters: ExpenseFilterValues) => void;
  onReset?: () => void;
  categories: string[];
}

const ExpenseFilter: React.FC<ExpenseFilterProps> = ({
  initialValues = {},
  onFilter,
  onReset,
  categories
}) => {
  // Estado dos filtros
  const [searchTerm, setSearchTerm] = useState(initialValues.searchTerm || '');
  const [category, setCategory] = useState(initialValues.category || '');
  const [dateFrom, setDateFrom] = useState<Date | null>(initialValues.dateFrom || null);
  const [dateTo, setDateTo] = useState<Date | null>(initialValues.dateTo || null);
  const [minValue, setMinValue] = useState(initialValues.minValue || '');
  const [maxValue, setMaxValue] = useState(initialValues.maxValue || '');
  const [sortBy, setSortBy] = useState(initialValues.sortBy || 'date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(initialValues.sortOrder || 'desc');
  
  // Opções de ordenação
  const sortOptions = [
    { value: 'date', label: 'Data' },
    { value: 'value', label: 'Valor' },
    { value: 'category', label: 'Categoria' }
  ];

  // Aplicar filtros
  const handleApplyFilters = () => {
    onFilter({
      searchTerm,
      category,
      dateFrom,
      dateTo,
      minValue,
      maxValue,
      sortBy,
      sortOrder
    });
  };

  // Limpar filtros
  const handleResetFilters = () => {
    setSearchTerm('');
    setCategory('');
    setDateFrom(null);
    setDateTo(null);
    setMinValue('');
    setMaxValue('');
    setSortBy('date');
    setSortOrder('desc');
    
    if (onReset) {
      onReset();
    } else {
      onFilter({
        searchTerm: '',
        category: '',
        dateFrom: null,
        dateTo: null,
        minValue: '',
        maxValue: '',
        sortBy: 'date',
        sortOrder: 'desc'
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Filtrar Despesas</h3>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Busca por termo */}
          <Input
            label="Buscar"
            placeholder="Buscar por categoria ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          {/* Seletor de Categoria */}
          <div>
            <CategorySelector
              value={category}
              onChange={setCategory}
              predefinedCategories={categories}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Intervalo de Datas */}
          <div>
            <DatePicker
              label="Data Inicial"
              selected={dateFrom}
              onChange={(date) => setDateFrom(date)}
              dateFormat="dd/MM/yyyy"
              isClearable
              placeholderText="Selecione a data inicial"
            />
          </div>
          <div>
            <DatePicker
              label="Data Final"
              selected={dateTo}
              onChange={(date) => setDateTo(date)}
              dateFormat="dd/MM/yyyy"
              isClearable
              placeholderText="Selecione a data final"
              minDate={dateFrom || undefined}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Intervalo de Valores */}
          <Input
            label="Valor Mínimo (R$)"
            type="number"
            min="0"
            step="0.01"
            value={minValue}
            onChange={(e) => setMinValue(e.target.value)}
            placeholder="0,00"
          />
          <Input
            label="Valor Máximo (R$)"
            type="number"
            min="0"
            step="0.01"
            value={maxValue}
            onChange={(e) => setMaxValue(e.target.value)}
            placeholder="0,00"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Ordenação */}
          <Select
            label="Ordenar por"
            options={sortOptions}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          />
          <Select
            label="Ordem"
            options={[
              { value: 'asc', label: 'Crescente' },
              { value: 'desc', label: 'Decrescente' }
            ]}
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
          />
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end space-x-2">
        <Button 
          variant="outline" 
          onClick={handleResetFilters}
        >
          Limpar Filtros
        </Button>
        <Button 
          onClick={handleApplyFilters}
        >
          Aplicar Filtros
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ExpenseFilter;