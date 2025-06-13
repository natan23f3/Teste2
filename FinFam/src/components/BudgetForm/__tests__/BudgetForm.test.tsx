import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BudgetForm from '../BudgetForm';
import { useBudget } from '../../../hooks/useBudget';

// Mock do hook useBudget
jest.mock('../../../hooks/useBudget', () => ({
  useBudget: jest.fn()
}));

// Mock do componente CategorySelector
jest.mock('../CategorySelector', () => ({
  __esModule: true,
  default: ({ value, onChange }: { value: string; onChange: (value: string) => void }) => (
    <select 
      data-testid="category-selector" 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Selecione uma categoria</option>
      <option value="Alimentação">Alimentação</option>
      <option value="Moradia">Moradia</option>
      <option value="Transporte">Transporte</option>
    </select>
  )
}));

// Mock dos componentes UI
jest.mock('../../UI/Card', () => ({
  Card: ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={className} data-testid="card">{children}</div>
  ),
  CardHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-header">{children}</div>
  ),
  CardContent: ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={className} data-testid="card-content">{children}</div>
  ),
  CardFooter: ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={className} data-testid="card-footer">{children}</div>
  )
}));

jest.mock('../../UI/Input', () => ({
  Input: ({ label, type, value, onChange, errorMessage, ...props }: any) => (
    <div>
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        data-testid={`input-${label?.toLowerCase().replace(/\s/g, '-')}`}
        {...props}
      />
      {errorMessage && <p data-testid="error-message">{errorMessage}</p>}
    </div>
  )
}));

jest.mock('../../UI/Button', () => ({
  Button: ({ children, onClick, type, disabled, isLoading, variant }: any) => (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      data-testid={`button-${variant || 'primary'}`}
    >
      {isLoading ? 'Carregando...' : children}
    </button>
  )
}));

jest.mock('../../UI/DatePicker', () => ({
  DatePicker: ({ label, selected, onChange }: any) => (
    <div>
      <label>{label}</label>
      <input
        type="date"
        value={selected instanceof Date ? selected.toISOString().split('T')[0] : ''}
        onChange={(e) => {
          const date = new Date(e.target.value);
          onChange(date);
        }}
        data-testid="date-picker"
      />
    </div>
  )
}));

describe('BudgetForm', () => {
  const mockCreateBudget = jest.fn();
  const mockUpdateBudget = jest.fn();
  const mockOnSuccess = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Configuração padrão do mock do hook useBudget
    (useBudget as jest.Mock).mockReturnValue({
      createBudget: mockCreateBudget,
      updateBudget: mockUpdateBudget,
      isCreating: false,
      isUpdating: false,
      createError: null,
      updateError: null
    });
  });

  it('renderiza o formulário de criação de orçamento corretamente', () => {
    render(<BudgetForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
    
    // Verifica se o título está correto
    expect(screen.getByText('Novo Orçamento')).toBeInTheDocument();
    
    // Verifica se os campos do formulário estão presentes
    expect(screen.getByTestId('category-selector')).toBeInTheDocument();
    expect(screen.getByTestId('input-valor-(r$)')).toBeInTheDocument();
    expect(screen.getByTestId('date-picker')).toBeInTheDocument();
    
    // Verifica se os botões estão presentes
    expect(screen.getByText('Criar Orçamento')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
  });

  it('renderiza o formulário de edição de orçamento corretamente', () => {
    const mockBudget = {
      id: 1,
      category: 'Alimentação',
      value: 500,
      date: '2025-06-01T00:00:00.000Z',
      familyId: 1
    };
    
    render(<BudgetForm budget={mockBudget} onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
    
    // Verifica se o título está correto
    expect(screen.getByText('Editar Orçamento')).toBeInTheDocument();
    
    // Verifica se os campos do formulário estão preenchidos com os valores do orçamento
    expect(screen.getByTestId('category-selector')).toHaveValue('Alimentação');
    expect(screen.getByTestId('input-valor-(r$)')).toHaveValue('500');
    
    // Verifica se os botões estão presentes
    expect(screen.getByText('Atualizar Orçamento')).toBeInTheDocument();
  });

  it('valida os campos obrigatórios ao submeter o formulário', async () => {
    render(<BudgetForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
    
    // Submete o formulário sem preencher os campos
    fireEvent.click(screen.getByText('Criar Orçamento'));
    
    // Verifica se as mensagens de erro são exibidas
    await waitFor(() => {
      expect(screen.getByText('Categoria é obrigatória')).toBeInTheDocument();
      expect(screen.getByText('Valor é obrigatório')).toBeInTheDocument();
    });
    
    // Verifica se a função de criação não foi chamada
    expect(mockCreateBudget).not.toHaveBeenCalled();
  });

  it('cria um novo orçamento quando o formulário é preenchido corretamente', async () => {
    const user = userEvent.setup();
    
    render(<BudgetForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
    
    // Preenche os campos do formulário
    await user.selectOptions(screen.getByTestId('category-selector'), 'Alimentação');
    await user.type(screen.getByTestId('input-valor-(r$)'), '500');
    
    // Configura a data
    fireEvent.change(screen.getByTestId('date-picker'), {
      target: { value: '2025-06-01' }
    });
    
    // Submete o formulário
    await user.click(screen.getByText('Criar Orçamento'));
    
    // Verifica se a função de criação foi chamada com os parâmetros corretos
    await waitFor(() => {
      expect(mockCreateBudget).toHaveBeenCalledWith({
        category: 'Alimentação',
        value: 500,
        date: expect.any(String)
      });
    });
    
    // Verifica se a função de sucesso foi chamada
    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it('atualiza um orçamento existente quando o formulário é preenchido corretamente', async () => {
    const user = userEvent.setup();
    
    const mockBudget = {
      id: 1,
      category: 'Alimentação',
      value: 500,
      date: '2025-06-01T00:00:00.000Z',
      familyId: 1
    };
    
    render(<BudgetForm budget={mockBudget} onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
    
    // Altera os campos do formulário
    await user.selectOptions(screen.getByTestId('category-selector'), 'Moradia');
    await user.clear(screen.getByTestId('input-valor-(r$)'));
    await user.type(screen.getByTestId('input-valor-(r$)'), '1000');
    
    // Submete o formulário
    await user.click(screen.getByText('Atualizar Orçamento'));
    
    // Verifica se a função de atualização foi chamada com os parâmetros corretos
    await waitFor(() => {
      expect(mockUpdateBudget).toHaveBeenCalledWith(1, {
        category: 'Moradia',
        value: 1000,
        date: expect.any(String)
      });
    });
    
    // Verifica se a função de sucesso foi chamada
    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it('chama a função onCancel quando o botão Cancelar é clicado', async () => {
    const user = userEvent.setup();
    
    render(<BudgetForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
    
    // Clica no botão Cancelar
    await user.click(screen.getByText('Cancelar'));
    
    // Verifica se a função onCancel foi chamada
    expect(mockOnCancel).toHaveBeenCalled();
  });
});