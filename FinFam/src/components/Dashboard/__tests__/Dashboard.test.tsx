import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dashboard from '../Dashboard';
import { useFamily } from '../../../hooks/useFamily';
import { useBudget } from '../../../hooks/useBudget';
import { useExpense } from '../../../hooks/useExpense';

// Mock dos hooks
jest.mock('../../../hooks/useFamily', () => ({
  useFamily: jest.fn()
}));

jest.mock('../../../hooks/useBudget', () => ({
  useBudget: jest.fn()
}));

jest.mock('../../../hooks/useExpense', () => ({
  useExpense: jest.fn()
}));

// Mock dos componentes de resumo
jest.mock('../BudgetSummary', () => ({
  __esModule: true,
  default: ({ budgets, expenses, isLoading }: any) => (
    <div data-testid="budget-summary">
      Budget Summary Component
      <div data-testid="budget-count">{budgets.length}</div>
    </div>
  )
}));

jest.mock('../ExpenseSummary', () => ({
  __esModule: true,
  default: ({ expenses, isLoading }: any) => (
    <div data-testid="expense-summary">
      Expense Summary Component
      <div data-testid="expense-count">{expenses.length}</div>
    </div>
  )
}));

jest.mock('../FinancialOverview', () => ({
  __esModule: true,
  default: ({ budgets, expenses, isLoading }: any) => (
    <div data-testid="financial-overview">
      Financial Overview Component
    </div>
  )
}));

jest.mock('../GoalProgress', () => ({
  __esModule: true,
  default: ({ isLoading }: any) => (
    <div data-testid="goal-progress">
      Goal Progress Component
    </div>
  )
}));

// Mock dos componentes UI
jest.mock('../../../components/UI/Card', () => ({
  Card: ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={className} data-testid="card">{children}</div>
  ),
  CardHeader: ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={className} data-testid="card-header">{children}</div>
  ),
  CardContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-content">{children}</div>
  )
}));

jest.mock('../../../components/UI/Button', () => ({
  Button: ({ children, variant, size, onClick }: any) => (
    <button 
      onClick={onClick} 
      data-testid={`button-${variant || 'primary'}`}
      data-size={size}
    >
      {children}
    </button>
  )
}));

jest.mock('../../../components/UI/Tabs', () => ({
  Tabs: ({ children, defaultTab, onChange }: any) => (
    <div data-testid="tabs" data-default-tab={defaultTab}>
      {children}
    </div>
  ),
  TabList: ({ children }: any) => (
    <div data-testid="tab-list">{children}</div>
  ),
  TabButton: ({ children, id }: any) => (
    <button data-testid={`tab-button-${id}`}>{children}</button>
  ),
  TabPanels: ({ children }: any) => (
    <div data-testid="tab-panels">{children}</div>
  ),
  TabPanel: ({ children, id }: any) => (
    <div data-testid={`tab-panel-${id}`}>{children}</div>
  )
}));

describe('Dashboard', () => {
  // Dados de teste
  const mockFamily = { id: 1, name: 'Família Teste', adminId: 1 };
  const mockBudgets = [
    { id: 1, category: 'Alimentação', value: 1000, date: '2025-06-01', familyId: 1 },
    { id: 2, category: 'Moradia', value: 2000, date: '2025-06-01', familyId: 1 }
  ];
  const mockExpenses = [
    { id: 1, category: 'Alimentação', value: 800, date: '2025-06-05', familyId: 1 },
    { id: 2, category: 'Moradia', value: 1800, date: '2025-06-10', familyId: 1 }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('exibe mensagem quando nenhuma família está selecionada', () => {
    // Configurar os mocks para simular nenhuma família selecionada
    (useFamily as jest.Mock).mockReturnValue({
      selectedFamily: null
    });
    (useBudget as jest.Mock).mockReturnValue({
      budgets: [],
      isLoadingBudgets: false
    });
    (useExpense as jest.Mock).mockReturnValue({
      expenses: [],
      isLoadingExpenses: false
    });

    render(<Dashboard />);

    // Verificar se a mensagem de nenhuma família selecionada é exibida
    expect(screen.getByText('Nenhuma família selecionada')).toBeInTheDocument();
    expect(screen.getByText('Selecione uma família para visualizar o dashboard financeiro.')).toBeInTheDocument();
  });

  it('renderiza o dashboard corretamente quando uma família está selecionada', () => {
    // Configurar os mocks para simular uma família selecionada
    (useFamily as jest.Mock).mockReturnValue({
      selectedFamily: mockFamily
    });
    (useBudget as jest.Mock).mockReturnValue({
      budgets: mockBudgets,
      isLoadingBudgets: false
    });
    (useExpense as jest.Mock).mockReturnValue({
      expenses: mockExpenses,
      isLoadingExpenses: false
    });

    render(<Dashboard />);

    // Verificar se o título do dashboard é exibido
    expect(screen.getByText('Dashboard Financeiro')).toBeInTheDocument();

    // Verificar se os botões de exportação estão presentes
    expect(screen.getByText('Exportar PDF')).toBeInTheDocument();
    expect(screen.getByText('Exportar CSV')).toBeInTheDocument();

    // Verificar se os cards de resumo estão presentes
    expect(screen.getByText('Total Orçado')).toBeInTheDocument();
    expect(screen.getByText('Total Gasto')).toBeInTheDocument();
    expect(screen.getByText('Saldo')).toBeInTheDocument();
    expect(screen.getByText('Progresso de Metas')).toBeInTheDocument();

    // Verificar se os valores estão corretos
    expect(screen.getByText('R$ 3000.00')).toBeInTheDocument(); // Total Orçado
    expect(screen.getByText('R$ 2600.00')).toBeInTheDocument(); // Total Gasto
    expect(screen.getByText('R$ 400.00')).toBeInTheDocument(); // Saldo

    // Verificar se as tabs estão presentes
    expect(screen.getByText('Visão Geral')).toBeInTheDocument();
    expect(screen.getByText('Orçamentos')).toBeInTheDocument();
    expect(screen.getByText('Despesas')).toBeInTheDocument();
    expect(screen.getByText('Metas')).toBeInTheDocument();

    // Verificar se o componente de visão geral está sendo renderizado
    expect(screen.getByTestId('financial-overview')).toBeInTheDocument();
  });

  it('exibe indicadores de carregamento quando os dados estão sendo carregados', () => {
    // Configurar os mocks para simular carregamento
    (useFamily as jest.Mock).mockReturnValue({
      selectedFamily: mockFamily
    });
    (useBudget as jest.Mock).mockReturnValue({
      budgets: [],
      isLoadingBudgets: true
    });
    (useExpense as jest.Mock).mockReturnValue({
      expenses: [],
      isLoadingExpenses: true
    });

    render(<Dashboard />);

    // Verificar se os indicadores de carregamento estão presentes
    const loadingIndicators = screen.getAllByText('Carregando...');
    expect(loadingIndicators.length).toBe(4); // 4 cards com indicadores de carregamento
  });

  it('altera a tab ativa quando uma tab é clicada', async () => {
    const user = userEvent.setup();
    
    // Configurar os mocks
    (useFamily as jest.Mock).mockReturnValue({
      selectedFamily: mockFamily
    });
    (useBudget as jest.Mock).mockReturnValue({
      budgets: mockBudgets,
      isLoadingBudgets: false
    });
    (useExpense as jest.Mock).mockReturnValue({
      expenses: mockExpenses,
      isLoadingExpenses: false
    });

    render(<Dashboard />);

    // Verificar se a tab de visão geral está ativa inicialmente
    expect(screen.getByTestId('financial-overview')).toBeInTheDocument();

    // Clicar na tab de orçamentos
    await user.click(screen.getByTestId('tab-button-budgets'));

    // Verificar se o componente de orçamentos está sendo renderizado
    expect(screen.getByTestId('budget-summary')).toBeInTheDocument();
    expect(screen.getByTestId('budget-count')).toHaveTextContent('2');

    // Clicar na tab de despesas
    await user.click(screen.getByTestId('tab-button-expenses'));

    // Verificar se o componente de despesas está sendo renderizado
    expect(screen.getByTestId('expense-summary')).toBeInTheDocument();
    expect(screen.getByTestId('expense-count')).toHaveTextContent('2');

    // Clicar na tab de metas
    await user.click(screen.getByTestId('tab-button-goals'));

    // Verificar se o componente de metas está sendo renderizado
    expect(screen.getByTestId('goal-progress')).toBeInTheDocument();
  });
});