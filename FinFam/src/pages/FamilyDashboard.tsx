import React from 'react';
import { Link } from 'react-router-dom';
import { useFamily } from '../hooks/useFamily';
import { useBudget } from '../hooks/useBudget';
import { useExpense } from '../hooks/useExpense';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardDescription,
  CardFooter 
} from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { Chart } from '../components/UI/Chart';
import FamilySelector from '../components/Family/FamilySelector';

const FamilyDashboard = () => {
  const { selectedFamily } = useFamily();
  const { budgets } = useBudget();
  const { expenses } = useExpense();

  // Dados de exemplo para os gráficos
  const expenseData = [
    { category: 'Alimentação', value: 1200 },
    { category: 'Moradia', value: 2500 },
    { category: 'Transporte', value: 800 },
    { category: 'Lazer', value: 500 },
    { category: 'Saúde', value: 600 },
    { category: 'Educação', value: 1000 },
    { category: 'Outros', value: 400 }
  ];

  const budgetComplianceData = [
    { month: 'Jan', compliance: 95 },
    { month: 'Fev', compliance: 92 },
    { month: 'Mar', compliance: 88 },
    { month: 'Abr', compliance: 90 },
    { month: 'Mai', compliance: 85 },
    { month: 'Jun', compliance: 93 }
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Familiar</h1>
          <p className="text-gray-600">
            Gerencie e monitore as finanças da sua família
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <FamilySelector />
        </div>
      </div>

      {!selectedFamily ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500 mb-4">
              Selecione uma família para visualizar o dashboard ou crie uma nova família.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Sistema Hierárquico - Cards de Navegação */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciamento de Família</CardTitle>
                <CardDescription>
                  Gerencie membros e convites da família
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Adicione novos membros, envie convites e gerencie os membros existentes da sua família.
                </p>
              </CardContent>
              <CardFooter>
                <Link to="/family/management" className="w-full">
                  <Button variant="outline" className="w-full">
                    Gerenciar Membros
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Controle de Acesso</CardTitle>
                <CardDescription>
                  Defina permissões e níveis de acesso
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Configure funções, permissões e níveis de acesso para cada membro da família.
                </p>
              </CardContent>
              <CardFooter>
                <Link to="/family/access" className="w-full">
                  <Button variant="outline" className="w-full">
                    Configurar Acesso
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monitoramento</CardTitle>
                <CardDescription>
                  Acompanhe atividades e conformidade
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Monitore atividades dos membros, conformidade com orçamento e rastreamento de despesas.
                </p>
              </CardContent>
              <CardFooter>
                <Link to="/family/monitoring" className="w-full">
                  <Button variant="outline" className="w-full">
                    Ver Monitoramento
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>

          {/* Resumo Financeiro */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Despesas por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <Chart
                  type="pie"
                  data={expenseData}
                  xAxisDataKey="category"
                  series={[
                    { dataKey: 'value', name: 'Valor' }
                  ]}
                  size="md"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conformidade com Orçamento</CardTitle>
              </CardHeader>
              <CardContent>
                <Chart
                  type="line"
                  data={budgetComplianceData}
                  xAxisDataKey="month"
                  xAxisLabel="Mês"
                  yAxisLabel="Conformidade (%)"
                  series={[
                    { dataKey: 'compliance', name: 'Conformidade', color: '#3b82f6' }
                  ]}
                  size="md"
                />
              </CardContent>
            </Card>
          </div>

          {/* Ações Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button>Adicionar Despesa</Button>
                <Button variant="outline">Criar Orçamento</Button>
                <Button variant="outline">Ver Relatórios</Button>
                <Button variant="outline">Configurações</Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default FamilyDashboard;