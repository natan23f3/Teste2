import React, { useState } from 'react';
import { useFamily } from '../../../hooks/useFamily';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  CardDescription 
} from '../../UI/Card';
import { Chart } from '../../UI/Chart';
import { Table } from '../../UI/Table';
import { Badge } from '../../UI/Badge';
import { Select } from '../../UI/Select';
import { Button } from '../../UI/Button';

interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
  memberId: number;
  memberName: string;
  paymentMethod: string;
  status: 'approved' | 'pending' | 'rejected';
}

const ExpenseTracking: React.FC = () => {
  const { selectedFamily } = useFamily();
  const [timeRange, setTimeRange] = useState('month');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [memberFilter, setMemberFilter] = useState('all');

  // Opções para os filtros
  const timeRangeOptions = [
    { value: 'week', label: 'Esta Semana' },
    { value: 'month', label: 'Este Mês' },
    { value: 'quarter', label: 'Este Trimestre' },
    { value: 'year', label: 'Este Ano' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'Todas as Categorias' },
    { value: 'alimentacao', label: 'Alimentação' },
    { value: 'moradia', label: 'Moradia' },
    { value: 'transporte', label: 'Transporte' },
    { value: 'lazer', label: 'Lazer' },
    { value: 'saude', label: 'Saúde' },
    { value: 'educacao', label: 'Educação' },
    { value: 'outros', label: 'Outros' }
  ];

  const memberOptions = [
    { value: 'all', label: 'Todos os Membros' },
    { value: '1', label: 'João Silva' },
    { value: '2', label: 'Maria Oliveira' },
    { value: '3', label: 'Pedro Santos' }
  ];

  // Dados de exemplo para despesas
  const expenses: Expense[] = [
    {
      id: 1,
      description: 'Supermercado',
      amount: 250.00,
      category: 'alimentacao',
      date: '2025-06-10',
      memberId: 1,
      memberName: 'João Silva',
      paymentMethod: 'Cartão de Crédito',
      status: 'approved'
    },
    {
      id: 2,
      description: 'Aluguel',
      amount: 1800.00,
      category: 'moradia',
      date: '2025-06-05',
      memberId: 2,
      memberName: 'Maria Oliveira',
      paymentMethod: 'Transferência',
      status: 'approved'
    },
    {
      id: 3,
      description: 'Combustível',
      amount: 200.00,
      category: 'transporte',
      date: '2025-06-08',
      memberId: 3,
      memberName: 'Pedro Santos',
      paymentMethod: 'Cartão de Débito',
      status: 'approved'
    },
    {
      id: 4,
      description: 'Restaurante',
      amount: 120.00,
      category: 'alimentacao',
      date: '2025-06-12',
      memberId: 1,
      memberName: 'João Silva',
      paymentMethod: 'Cartão de Crédito',
      status: 'approved'
    },
    {
      id: 5,
      description: 'Farmácia',
      amount: 85.00,
      category: 'saude',
      date: '2025-06-09',
      memberId: 2,
      memberName: 'Maria Oliveira',
      paymentMethod: 'Cartão de Débito',
      status: 'approved'
    },
    {
      id: 6,
      description: 'Mensalidade Escola',
      amount: 800.00,
      category: 'educacao',
      date: '2025-06-07',
      memberId: 2,
      memberName: 'Maria Oliveira',
      paymentMethod: 'Transferência',
      status: 'approved'
    },
    {
      id: 7,
      description: 'Cinema',
      amount: 60.00,
      category: 'lazer',
      date: '2025-06-11',
      memberId: 3,
      memberName: 'Pedro Santos',
      paymentMethod: 'Cartão de Crédito',
      status: 'pending'
    }
  ];

  // Filtrar despesas com base nos filtros selecionados
  const filteredExpenses = expenses.filter(expense => {
    const categoryMatch = categoryFilter === 'all' || expense.category === categoryFilter;
    const memberMatch = memberFilter === 'all' || expense.memberId.toString() === memberFilter;
    return categoryMatch && memberMatch;
  });

  // Calcular o total de despesas
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Dados para o gráfico de despesas por categoria
  const expensesByCategory = categoryOptions
    .filter(option => option.value !== 'all')
    .map(category => {
      const amount = expenses
        .filter(expense => expense.category === category.value)
        .reduce((sum, expense) => sum + expense.amount, 0);
      
      return {
        name: category.label,
        value: amount
      };
    })
    .filter(item => item.value > 0);

  // Dados para o gráfico de despesas por membro
  const expensesByMember = memberOptions
    .filter(option => option.value !== 'all')
    .map(member => {
      const amount = expenses
        .filter(expense => expense.memberId.toString() === member.value)
        .reduce((sum, expense) => sum + expense.amount, 0);
      
      return {
        name: member.label,
        value: amount
      };
    });

  // Dados para o gráfico de tendência de despesas
  const expenseTrend = [
    { date: '01/06', value: 450 },
    { date: '02/06', value: 200 },
    { date: '03/06', value: 350 },
    { date: '04/06', value: 180 },
    { date: '05/06', value: 2000 },
    { date: '06/06', value: 120 },
    { date: '07/06', value: 800 },
    { date: '08/06', value: 200 },
    { date: '09/06', value: 85 },
    { date: '10/06', value: 250 },
    { date: '11/06', value: 60 },
    { date: '12/06', value: 120 }
  ];

  // Função para formatar valor monetário
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  // Função para formatar data
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch (error) {
      return 'Data inválida';
    }
  };

  // Função para renderizar o badge de status
  const renderStatusBadge = (status: 'approved' | 'pending' | 'rejected') => {
    switch (status) {
      case 'approved':
        return <Badge variant="success">Aprovado</Badge>;
      case 'pending':
        return <Badge variant="warning">Pendente</Badge>;
      case 'rejected':
        return <Badge variant="danger">Rejeitado</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle>Rastreamento de Despesas</CardTitle>
              <CardDescription>
                Acompanhe e analise as despesas da família
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="w-40">
                <Select
                  options={timeRangeOptions}
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  size="sm"
                />
              </div>
              <div className="w-48">
                <Select
                  options={categoryOptions}
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  size="sm"
                />
              </div>
              <div className="w-48">
                <Select
                  options={memberOptions}
                  value={memberFilter}
                  onChange={(e) => setMemberFilter(e.target.value)}
                  size="sm"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-sm text-gray-500">Total de Despesas</div>
                  <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalExpenses)}</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-sm text-gray-500">Média por Despesa</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(filteredExpenses.length > 0 ? totalExpenses / filteredExpenses.length : 0)}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-sm text-gray-500">Quantidade de Despesas</div>
                  <div className="text-2xl font-bold text-blue-600">{filteredExpenses.length}</div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Despesas por Categoria</h3>
              <Chart
                type="pie"
                data={expensesByCategory}
                xAxisDataKey="name"
                series={[
                  { dataKey: 'value', name: 'Valor' }
                ]}
                size="md"
              />
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Despesas por Membro</h3>
              <Chart
                type="bar"
                data={expensesByMember}
                xAxisDataKey="name"
                xAxisLabel="Membro"
                yAxisLabel="Valor (R$)"
                series={[
                  { dataKey: 'value', name: 'Valor', color: '#3b82f6' }
                ]}
                size="md"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Tendência de Despesas</h3>
            <Chart
              type="line"
              data={expenseTrend}
              xAxisDataKey="date"
              xAxisLabel="Data"
              yAxisLabel="Valor (R$)"
              series={[
                { dataKey: 'value', name: 'Valor', color: '#3b82f6' }
              ]}
              size="md"
            />
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Lista de Despesas</h3>
            <Table
              data={filteredExpenses}
              columns={[
                { header: 'Descrição', accessor: 'description' },
                { 
                  header: 'Valor', 
                  accessor: 'amount',
                  cell: (value: number) => formatCurrency(value)
                },
                { 
                  header: 'Categoria', 
                  accessor: 'category',
                  cell: (value: string) => {
                    const category = categoryOptions.find(cat => cat.value === value);
                    return category ? category.label : value;
                  }
                },
                { 
                  header: 'Data', 
                  accessor: 'date',
                  cell: (value: string) => formatDate(value)
                },
                { header: 'Membro', accessor: 'memberName' },
                { 
                  header: 'Status', 
                  accessor: 'status',
                  cell: (value: 'approved' | 'pending' | 'rejected') => renderStatusBadge(value)
                }
              ]}
              bordered
              hoverable
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseTracking;