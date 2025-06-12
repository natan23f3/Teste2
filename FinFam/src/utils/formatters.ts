/**
 * Utilitários para formatação de valores
 */

/**
 * Formata um valor numérico como moeda brasileira (R$)
 * 
 * @param value - Valor a ser formatado (em centavos)
 * @returns String formatada como moeda brasileira
 */
export const formatCurrency = (value: number): string => {
  // Converte de centavos para reais
  const valueInReais = value / 100;
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valueInReais);
};

/**
 * Formata uma data para o formato brasileiro (DD/MM/YYYY)
 * 
 * @param date - Data a ser formatada (string ISO ou objeto Date)
 * @returns String formatada como data brasileira
 */
export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('pt-BR').format(dateObj);
};

/**
 * Formata uma data para o formato ISO (YYYY-MM-DD)
 * 
 * @param date - Data a ser formatada (string ou objeto Date)
 * @returns String formatada como data ISO
 */
export const formatDateToISO = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toISOString().split('T')[0];
};

/**
 * Formata um valor numérico como porcentagem
 * 
 * @param value - Valor a ser formatado (0.1 = 10%)
 * @returns String formatada como porcentagem
 */
export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Converte um valor de moeda (R$ 1.234,56) para centavos (123456)
 * 
 * @param currencyString - String formatada como moeda
 * @returns Valor em centavos (número inteiro)
 */
export const currencyToNumber = (currencyString: string): number => {
  // Remove o símbolo da moeda e espaços
  const cleanString = currencyString.replace(/[R$\s.]/g, '').replace(',', '.');
  
  // Converte para número e multiplica por 100 para obter centavos
  return Math.round(parseFloat(cleanString) * 100);
};