import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Family, familyService } from '../services/familyService';
import { useAuth } from '../hooks/useAuth';

// Interface para o contexto de família
export interface FamilyContextType {
  families: Family[];
  selectedFamily: Family | null;
  loading: boolean;
  error: string | null;
  fetchFamilies: () => Promise<void>;
  selectFamily: (familyId: number) => Promise<void>;
  createFamily: (name: string) => Promise<Family>;
  updateFamily: (id: number, name: string) => Promise<Family>;
  addMember: (familyId: number, email: string) => Promise<void>;
}

// Valor padrão do contexto
const defaultFamilyContext: FamilyContextType = {
  families: [],
  selectedFamily: null,
  loading: false,
  error: null,
  fetchFamilies: async () => {},
  selectFamily: async () => {},
  createFamily: async () => ({ id: 0, name: '', adminId: 0 }),
  updateFamily: async () => ({ id: 0, name: '', adminId: 0 }),
  addMember: async () => {},
};

// Criação do contexto
export const FamilyContext = createContext<FamilyContextType>(defaultFamilyContext);

// Props para o provedor de contexto
interface FamilyProviderProps {
  children: ReactNode;
}

// Componente provedor de contexto
export const FamilyProvider: React.FC<FamilyProviderProps> = ({ children }) => {
  const [families, setFamilies] = useState<Family[]>([]);
  const [selectedFamily, setSelectedFamily] = useState<Family | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  // Carregar famílias quando o usuário estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      fetchFamilies();
    }
  }, [isAuthenticated]);

  // Função para buscar todas as famílias do usuário
  const fetchFamilies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await familyService.listFamilies();
      setFamilies(data);
      
      // Se houver famílias e nenhuma estiver selecionada, seleciona a primeira
      if (data.length > 0 && !selectedFamily) {
        setSelectedFamily(data[0]);
      }
    } catch (err) {
      setError('Erro ao buscar famílias');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Função para selecionar uma família
  const selectFamily = async (familyId: number) => {
    try {
      setLoading(true);
      setError(null);
      
      // Verifica se a família já está carregada na lista
      let family = families.find(f => f.id === familyId);
      
      // Se não estiver, busca do servidor
      if (!family) {
        family = await familyService.getFamily(familyId);
      }
      
      setSelectedFamily(family);
    } catch (err) {
      setError('Erro ao selecionar família');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Função para criar uma nova família
  const createFamily = async (name: string) => {
    try {
      setLoading(true);
      setError(null);
      const newFamily = await familyService.createFamily({ name });
      
      // Atualiza a lista de famílias
      setFamilies(prev => [...prev, newFamily]);
      
      // Seleciona a nova família
      setSelectedFamily(newFamily);
      
      return newFamily;
    } catch (err) {
      setError('Erro ao criar família');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Função para atualizar uma família
  const updateFamily = async (id: number, name: string) => {
    try {
      setLoading(true);
      setError(null);
      const updatedFamily = await familyService.updateFamily(id, { name });
      
      // Atualiza a lista de famílias
      setFamilies(prev => prev.map(f => f.id === id ? updatedFamily : f));
      
      // Atualiza a família selecionada se for a mesma
      if (selectedFamily && selectedFamily.id === id) {
        setSelectedFamily(updatedFamily);
      }
      
      return updatedFamily;
    } catch (err) {
      setError('Erro ao atualizar família');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Função para adicionar um membro à família
  const addMember = async (familyId: number, email: string) => {
    try {
      setLoading(true);
      setError(null);
      await familyService.addMember({ familyId, email });
      
      // Recarrega a família para obter a lista atualizada de membros
      if (selectedFamily && selectedFamily.id === familyId) {
        const updatedFamily = await familyService.getFamily(familyId);
        setSelectedFamily(updatedFamily);
      }
    } catch (err) {
      setError('Erro ao adicionar membro à família');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Valor do contexto
  const value: FamilyContextType = {
    families,
    selectedFamily,
    loading,
    error,
    fetchFamilies,
    selectFamily,
    createFamily,
    updateFamily,
    addMember,
  };

  return <FamilyContext.Provider value={value}>{children}</FamilyContext.Provider>;
};