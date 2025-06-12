import React, { useState } from 'react';
import { Card, CardContent } from '../../UI/Card';
import { Input } from '../../UI/Input';
import { Select } from '../../UI/Select';
import { Button } from '../../UI/Button';
import { DatePicker } from '../../UI/DatePicker';

/**
 * Interface para as props do componente
 */
interface CustomerFilterProps {
  onFilter: (filters: {
    search: string;
    status: string;
    dateRange: {
      from: string | null;
      to: string | null;
    };
  }) => void;
}

/**
 * Componente que fornece filtros para a lista de clientes
 */
const CustomerFilter: React.FC<CustomerFilterProps> = ({ onFilter }) => {
  // Estado para os filtros
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);

  // Opções para o filtro de status
  const statusOptions = [
    { value: 'all', label: 'Todos os Status' },
    { value: 'active', label: 'Ativo' },
    { value: 'inactive', label: 'Inativo' },
    { value: 'pending', label: 'Pendente' },
  ];

  // Função para aplicar os filtros
  const applyFilters = () => {
    onFilter({
      search,
      status,
      dateRange: {
        from: dateFrom ? dateFrom.toISOString().split('T')[0] : null,
        to: dateTo ? dateTo.toISOString().split('T')[0] : null,
      },
    });
  };

  // Função para limpar os filtros
  const clearFilters = () => {
    setSearch('');
    setStatus('all');
    setDateFrom(null);
    setDateTo(null);
    
    onFilter({
      search: '',
      status: 'all',
      dateRange: {
        from: null,
        to: null,
      },
    });
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Buscar
            </label>
            <Input
              id="search"
              type="text"
              placeholder="Nome ou email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <Select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={statusOptions}
            />
          </div>
          
          <div>
            <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Data de Registro (De)
            </label>
            <DatePicker
              id="dateFrom"
              selected={dateFrom}
              onChange={setDateFrom}
              placeholderText="Data inicial"
            />
          </div>
          
          <div>
            <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Data de Registro (Até)
            </label>
            <DatePicker
              id="dateTo"
              selected={dateTo}
              onChange={setDateTo}
              placeholderText="Data final"
              minDate={dateFrom || undefined}
            />
          </div>
        </div>
        
        <div className="flex justify-end mt-4 space-x-2">
          <Button variant="outline" onClick={clearFilters}>
            Limpar Filtros
          </Button>
          <Button variant="primary" onClick={applyFilters}>
            Aplicar Filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerFilter;