import { useContext } from 'react';
import { FamilyContext, FamilyContextType } from '../contexts/FamilyContext';

/**
 * Hook personalizado para acessar o contexto de família
 * 
 * Fornece acesso ao estado da família e métodos para gerenciar famílias
 * 
 * @returns O contexto de família
 */
export const useFamily = (): FamilyContextType => {
  const context = useContext(FamilyContext);
  
  if (!context) {
    throw new Error('useFamily deve ser usado dentro de um FamilyProvider');
  }
  
  return context;
};