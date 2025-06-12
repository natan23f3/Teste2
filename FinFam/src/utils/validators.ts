import { z } from 'zod';

/**
 * Utilitários para validação de dados
 */

/**
 * Valida um endereço de e-mail
 * 
 * @param email - Endereço de e-mail a ser validado
 * @returns true se o e-mail for válido, false caso contrário
 */
export const isValidEmail = (email: string): boolean => {
  const emailSchema = z.string().email();
  const result = emailSchema.safeParse(email);
  return result.success;
};

/**
 * Valida uma senha de acordo com critérios de segurança
 * - Mínimo de 8 caracteres
 * - Pelo menos uma letra maiúscula
 * - Pelo menos uma letra minúscula
 * - Pelo menos um número
 * 
 * @param password - Senha a ser validada
 * @returns true se a senha for válida, false caso contrário
 */
export const isValidPassword = (password: string): boolean => {
  const passwordSchema = z.string()
    .min(8, 'A senha deve ter pelo menos 8 caracteres')
    .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'A senha deve conter pelo menos um número');
  
  const result = passwordSchema.safeParse(password);
  return result.success;
};

/**
 * Valida um valor monetário (deve ser um número positivo)
 * 
 * @param value - Valor a ser validado
 * @returns true se o valor for válido, false caso contrário
 */
export const isValidMoneyValue = (value: number): boolean => {
  const valueSchema = z.number().min(0, 'O valor deve ser maior ou igual a zero');
  const result = valueSchema.safeParse(value);
  return result.success;
};

/**
 * Valida uma data (deve ser uma data válida e não futura)
 * 
 * @param date - Data a ser validada
 * @returns true se a data for válida, false caso contrário
 */
export const isValidPastDate = (date: string | Date): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  today.setHours(23, 59, 59, 999); // Final do dia atual
  
  const dateSchema = z.date().max(today, 'A data não pode ser futura');
  const result = dateSchema.safeParse(dateObj);
  return result.success;
};

/**
 * Valida um nome (deve ter pelo menos 2 caracteres)
 * 
 * @param name - Nome a ser validado
 * @returns true se o nome for válido, false caso contrário
 */
export const isValidName = (name: string): boolean => {
  const nameSchema = z.string().min(2, 'O nome deve ter pelo menos 2 caracteres');
  const result = nameSchema.safeParse(name);
  return result.success;
};

/**
 * Valida uma categoria (deve ter pelo menos 2 caracteres)
 * 
 * @param category - Categoria a ser validada
 * @returns true se a categoria for válida, false caso contrário
 */
export const isValidCategory = (category: string): boolean => {
  const categorySchema = z.string().min(2, 'A categoria deve ter pelo menos 2 caracteres');
  const result = categorySchema.safeParse(category);
  return result.success;
};

/**
 * Obtém mensagens de erro de um objeto Zod
 * 
 * @param result - Resultado da validação Zod
 * @returns Array de mensagens de erro ou null se não houver erros
 */
export const getZodErrors = (result: z.SafeParseReturnType<any, any>): string[] | null => {
  if (result.success) {
    return null;
  }
  
  return result.error.errors.map(err => err.message);
};