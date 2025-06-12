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

interface BudgetCategory {
  id: number;
  name: string;
  budgeted: number;
  actual: number;
  compliance: number;
}

const BudgetCompliance: React.FC = () => {
  const { selectedFamily } = useFamily();
  const [selectedMonth, setSelectedMonth] = useState('junho-2025');

  // Opções para o select de mês
  const monthOptions = [
    { value: 'junho-2025', label: 'Junho 2025' },
    { value: 'maio-2025', label: 'Maio 2025' },
    { value: 'abril-2025', label: 'Abril 2025' },
    { value: 'marco-2025', label: 'Março 2025' }
  ];

  // Dados de exemplo para categorias de orçamento
  const budgetCategories: BudgetCategory[] = [
    {
      id: 1,
      name: 'Alimentação',
      budgeted: 1200,
      actual: 1150,
      compliance: 96
    },
    {
      id: 2,
      name: 'Moradia',
      budgeted: 2500,
      actual: 2500,
      compliance: 100
    },
    {
      id: 3,
      name: 'Transporte',
      budgeted: 800,
      actual: 920,
      compliance: 85
    },
    {
      id: 4,
      name: 'Lazer',
      budgeted: 500,
      actual: 650,
      compliance: 70
    },
    {
      id: 5,
      name: 'Saúde',
      budgeted: 600,
      actual: 450,
      compliance: 100
    },
    {
      id: 6,
      name: 'Educação',
      budgeted: 1000,
      actual: 1000,
      compliance: 100
    },
    {
      id: 7,
      name: 'Outros',
      budgeted: 400,
      actual: 380,
      compliance: 95
    }
  ];

  // Dados para o gráfico de conformidade
  const complianceChartData = budgetCategories.map(category => ({
    name: category.name,
    compliance: category.compliance,
    budgeted: category.budgeted,
    actual: category.actual
  }));

  // Dados para o gráfico de comparação orçado vs. real
  const comparisonChartData = budgetCategories.map(category => ({
    name: category.name,
    budgeted: category.budgeted,
    actual: category.actual
  }));

  // Calcular a conformidade geral
  const overallCompliance = Math.round(
    budgetCategories.reduce((sum, category) => sum + category.compliance, 0) / budgetCategories.length
  );

  // Função para renderizar o badge de conformidade
  const renderComplianceBadge = (compliance: number) => {
    if (compliance >= 95) {
      return <Badge variant="success">{compliance}%</Badge>;
    } else if (compliance >= 80) {
      return <Badge variant="warning">{compliance}%</Badge>;
    } else {
      return <Badge variant="danger">{compliance}%</Badge>;
    }
  };

  // Função para formatar valor monetário
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Conformidade com Orçamento</CardTitle>
            <CardDescription>
              Análise de conformidade com o orçamento familiar
            </CardDescription>
          </div>
          <div className="w-48">
            <Select
              options={monthOptions}
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              label="Mês"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-48 h-48">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600">{overallCompliance}%</div>
                    <div className="text-sm text-gray-500">Conformidade Geral</div>
                  </div>
                </div>
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="10"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={
                      overallCompliance >= 95
                        ? '#10b981'
                        : overallCompliance >= 80
                        ? '#f59e0b'
                        : '#ef4444'
                    }
                    strokeWidth="10"
                    strokeDasharray={`${(overallCompliance / 100) * 251.2} 251.2`}
                    strokeDashoffset="0"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  {overallCompliance >= 95
                    ? 'Excelente! Seu orçamento está sendo seguido corretamente.'
                    : overallCompliance >= 80
                    ? 'Bom! Seu orçamento está sendo seguido, mas há espaço para melhorias.'
                    : 'Atenção! Seu orçamento não está sendo seguido adequadamente.'}
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Conformidade por Categoria</h3>
              <Chart
                type="bar"
                data={complianceChartData}
                xAxisDataKey="name"
                xAxisLabel="Categoria"
                yAxisLabel="Conformidade (%)"
                series={[
                  { dataKey: 'compliance', name: 'Conformidade', color: '#3b82f6' }
                ]}
                size="md"
              />
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Orçado vs. Real</h3>
            <Chart
              type="bar"
              data={comparisonChartData}
              xAxisDataKey="name"
              xAxisLabel="Categoria"
              yAxisLabel="Valor (R$)"
              series={[
                { dataKey: 'budgeted', name: 'Orçado', color: '#10b981' },
                { dataKey: 'actual', name: 'Real', color: '#f59e0b' }
              ]}
              size="md"
            />
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Detalhamento por Categoria</h3>
            <Table
              data={budgetCategories}
              columns={[
                { header: 'Categoria', accessor: 'name' },
                { 
                  header: 'Orçado', 
                  accessor: 'budgeted',
                  cell: (value: number) => formatCurrency(value)
                },
                { 
                  header: 'Real', 
                  accessor: 'actual',
                  cell: (value: number) => formatCurrency(value)
                },
                { 
                  header: 'Diferença', 
                  accessor: 'id',
                  cell: (_: any, row: Record<string, any>) => {
                    const diff = (row.budgeted as number) - (row.actual as number);
                    const isPositive = diff >= 0;
                    return (
                      <span className={isPositive ? 'text-green-600' : 'text-red-600'}>
                        {formatCurrency(Math.abs(diff))}
                        {isPositive ? ' (sobra)' : ' (excesso)'}
                      </span>
                    );
                  }
                },
                { 
                  header: 'Conformidade', 
                  accessor: 'compliance',
                  cell: (value: number) => renderComplianceBadge(value)
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

export default BudgetCompliance;