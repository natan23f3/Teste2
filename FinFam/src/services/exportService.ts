import jsPDF from 'jspdf';
import { CSVLink } from 'react-csv';
import { Budget } from './budgetService';
import { Expense } from './expenseService';

/**
 * Interface para cabeçalho CSV
 */
interface CSVHeader {
  label: string;
  key: string;
}

/**
 * Interface para dados CSV formatados
 */
interface CSVData {
  headers: CSVHeader[];
  data: any[];
}

/**
 * Serviço para exportação de relatórios em diferentes formatos
 */
class ExportService {
  /**
   * Formata um valor monetário para exibição
   * 
   * @param {number} value - Valor a ser formatado
   * @returns {string} - Valor formatado como moeda
   */
  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  /**
   * Formata uma data para exibição
   * 
   * @param {string | Date} date - Data a ser formatada
   * @returns {string} - Data formatada
   */
  private formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('pt-BR');
  }

  /**
   * Exporta orçamentos para PDF
   * 
   * @param {Budget[]} budgets - Lista de orçamentos
   * @param {string} familyName - Nome da família
   * @returns {jsPDF} - Documento PDF
   */
  exportBudgetsToPDF(budgets: Budget[], familyName: string): jsPDF {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Título
    doc.setFontSize(18);
    doc.text(`Relatório de Orçamentos - ${familyName}`, pageWidth / 2, 20, { align: 'center' });
    
    // Data do relatório
    doc.setFontSize(12);
    doc.text(`Gerado em: ${this.formatDate(new Date().toISOString())}`, pageWidth / 2, 30, { align: 'center' });
    
    // Cabeçalho da tabela
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Categoria', 20, 50);
    doc.text('Valor', 100, 50);
    doc.text('Data', 150, 50);
    
    // Linha separadora
    doc.line(20, 55, pageWidth - 20, 55);
    
    // Dados da tabela
    doc.setFont('helvetica', 'normal');
    let y = 65;
    
    budgets.forEach((budget, index) => {
      // Verificar se precisa de uma nova página
      if (y > 270) {
        doc.addPage();
        y = 20;
        
        // Cabeçalho da tabela na nova página
        doc.setFont('helvetica', 'bold');
        doc.text('Categoria', 20, y);
        doc.text('Valor', 100, y);
        doc.text('Data', 150, y);
        
        // Linha separadora
        doc.line(20, y + 5, pageWidth - 20, y + 5);
        
        doc.setFont('helvetica', 'normal');
        y += 15;
      }
      
      doc.text(budget.category, 20, y);
      doc.text(this.formatCurrency(budget.value), 100, y);
      doc.text(this.formatDate(budget.date), 150, y);
      
      y += 10;
    });
    
    // Resumo
    const totalBudget = budgets.reduce((sum, budget) => sum + budget.value, 0);
    
    y += 10;
    doc.setFont('helvetica', 'bold');
    doc.text('Total:', 20, y);
    doc.text(this.formatCurrency(totalBudget), 100, y);
    
    return doc;
  }

  /**
   * Exporta despesas para PDF
   * 
   * @param {Expense[]} expenses - Lista de despesas
   * @param {string} familyName - Nome da família
   * @returns {jsPDF} - Documento PDF
   */
  exportExpensesToPDF(expenses: Expense[], familyName: string): jsPDF {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Título
    doc.setFontSize(18);
    doc.text(`Relatório de Despesas - ${familyName}`, pageWidth / 2, 20, { align: 'center' });
    
    // Data do relatório
    doc.setFontSize(12);
    doc.text(`Gerado em: ${this.formatDate(new Date().toISOString())}`, pageWidth / 2, 30, { align: 'center' });
    
    // Cabeçalho da tabela
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Categoria', 20, 50);
    doc.text('Valor', 100, 50);
    doc.text('Data', 150, 50);
    
    // Linha separadora
    doc.line(20, 55, pageWidth - 20, 55);
    
    // Dados da tabela
    doc.setFont('helvetica', 'normal');
    let y = 65;
    
    expenses.forEach((expense, index) => {
      // Verificar se precisa de uma nova página
      if (y > 270) {
        doc.addPage();
        y = 20;
        
        // Cabeçalho da tabela na nova página
        doc.setFont('helvetica', 'bold');
        doc.text('Categoria', 20, y);
        doc.text('Valor', 100, y);
        doc.text('Data', 150, y);
        
        // Linha separadora
        doc.line(20, y + 5, pageWidth - 20, y + 5);
        
        doc.setFont('helvetica', 'normal');
        y += 15;
      }
      
      doc.text(expense.category, 20, y);
      doc.text(this.formatCurrency(expense.value), 100, y);
      doc.text(this.formatDate(expense.date), 150, y);
      
      y += 10;
    });
    
    // Resumo
    const totalExpense = expenses.reduce((sum, expense) => sum + expense.value, 0);
    
    y += 10;
    doc.setFont('helvetica', 'bold');
    doc.text('Total:', 20, y);
    doc.text(this.formatCurrency(totalExpense), 100, y);
    
    return doc;
  }

  /**
   * Exporta relatório financeiro para PDF
   * 
   * @param {Budget[]} budgets - Lista de orçamentos
   * @param {Expense[]} expenses - Lista de despesas
   * @param {string} familyName - Nome da família
   * @returns {jsPDF} - Documento PDF
   */
  exportFinancialReportToPDF(budgets: Budget[], expenses: Expense[], familyName: string): jsPDF {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Título
    doc.setFontSize(18);
    doc.text(`Relatório Financeiro - ${familyName}`, pageWidth / 2, 20, { align: 'center' });
    
    // Data do relatório
    doc.setFontSize(12);
    doc.text(`Gerado em: ${this.formatDate(new Date().toISOString())}`, pageWidth / 2, 30, { align: 'center' });
    
    // Resumo financeiro
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumo Financeiro', 20, 50);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    const totalBudget = budgets.reduce((sum, budget) => sum + budget.value, 0);
    const totalExpense = expenses.reduce((sum, expense) => sum + expense.value, 0);
    const balance = totalBudget - totalExpense;
    
    doc.text(`Total Orçado: ${this.formatCurrency(totalBudget)}`, 30, 65);
    doc.text(`Total Gasto: ${this.formatCurrency(totalExpense)}`, 30, 75);
    doc.text(`Saldo: ${this.formatCurrency(balance)}`, 30, 85);
    
    // Orçamentos por categoria
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Orçamentos por Categoria', 20, 105);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    // Agrupar orçamentos por categoria
    const budgetsByCategory: Record<string, number> = {};
    budgets.forEach(budget => {
      if (!budgetsByCategory[budget.category]) {
        budgetsByCategory[budget.category] = 0;
      }
      budgetsByCategory[budget.category] += budget.value;
    });
    
    let y = 120;
    Object.entries(budgetsByCategory).forEach(([category, value]) => {
      doc.text(`${category}: ${this.formatCurrency(value)}`, 30, y);
      y += 10;
    });
    
    // Despesas por categoria
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Despesas por Categoria', 20, y + 10);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    // Agrupar despesas por categoria
    const expensesByCategory: Record<string, number> = {};
    expenses.forEach(expense => {
      if (!expensesByCategory[expense.category]) {
        expensesByCategory[expense.category] = 0;
      }
      expensesByCategory[expense.category] += expense.value;
    });
    
    y += 25;
    Object.entries(expensesByCategory).forEach(([category, value]) => {
      doc.text(`${category}: ${this.formatCurrency(value)}`, 30, y);
      y += 10;
    });
    
    return doc;
  }

  /**
   * Prepara dados de orçamentos para exportação CSV
   * 
   * @param {Budget[]} budgets - Lista de orçamentos
   * @returns {CSVData} - Dados formatados para CSV
   */
  prepareBudgetsForCSV(budgets: Budget[]): CSVData {
    // Cabeçalho
    const headers: CSVHeader[] = [
      { label: 'ID', key: 'id' },
      { label: 'Categoria', key: 'category' },
      { label: 'Valor', key: 'value' },
      { label: 'Data', key: 'date' },
      { label: 'ID da Família', key: 'familyId' }
    ];
    
    // Dados formatados
    const data = budgets.map(budget => ({
      id: budget.id,
      category: budget.category,
      value: budget.value,
      date: this.formatDate(budget.date),
      familyId: budget.familyId
    }));
    
    return { headers, data };
  }

  /**
   * Prepara dados de despesas para exportação CSV
   * 
   * @param {Expense[]} expenses - Lista de despesas
   * @returns {CSVData} - Dados formatados para CSV
   */
  prepareExpensesForCSV(expenses: Expense[]): CSVData {
    // Cabeçalho
    const headers: CSVHeader[] = [
      { label: 'ID', key: 'id' },
      { label: 'Categoria', key: 'category' },
      { label: 'Valor', key: 'value' },
      { label: 'Data', key: 'date' },
      { label: 'ID da Família', key: 'familyId' }
    ];
    
    // Dados formatados
    const data = expenses.map(expense => ({
      id: expense.id,
      category: expense.category,
      value: expense.value,
      date: this.formatDate(expense.date),
      familyId: expense.familyId
    }));
    
    return { headers, data };
  }

  /**
   * Prepara dados de relatório financeiro para exportação CSV
   * 
   * @param {Budget[]} budgets - Lista de orçamentos
   * @param {Expense[]} expenses - Lista de despesas
   * @returns {CSVData} - Dados formatados para CSV
   */
  prepareFinancialReportForCSV(budgets: Budget[], expenses: Expense[]): CSVData {
    // Cabeçalho
    const headers: CSVHeader[] = [
      { label: 'Tipo', key: 'type' },
      { label: 'Categoria', key: 'category' },
      { label: 'Valor', key: 'value' },
      { label: 'Data', key: 'date' }
    ];
    
    // Dados formatados
    const budgetData = budgets.map(budget => ({
      type: 'Orçamento',
      category: budget.category,
      value: budget.value,
      date: this.formatDate(budget.date)
    }));
    
    const expenseData = expenses.map(expense => ({
      type: 'Despesa',
      category: expense.category,
      value: expense.value,
      date: this.formatDate(expense.date)
    }));
    
    // Adicionar linha de resumo
    const totalBudget = budgets.reduce((sum, budget) => sum + budget.value, 0);
    const totalExpense = expenses.reduce((sum, expense) => sum + expense.value, 0);
    const balance = totalBudget - totalExpense;
    
    const summaryData = [
      { type: 'Resumo', category: 'Total Orçado', value: totalBudget, date: '' },
      { type: 'Resumo', category: 'Total Gasto', value: totalExpense, date: '' },
      { type: 'Resumo', category: 'Saldo', value: balance, date: '' }
    ];
    
    return { headers, data: [...budgetData, ...expenseData, ...summaryData] };
  }
}

// Exporta uma instância singleton do serviço de exportação
export const exportService = new ExportService();

export default exportService;