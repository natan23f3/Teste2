import React, { useState } from 'react';
import { useFamily } from '../../hooks/useFamily';
import { Family } from '../../services/familyService';

interface FamilySelectorProps {
  className?: string;
}

/**
 * Componente para seleção da família ativa
 * 
 * Permite ao usuário selecionar uma família entre as disponíveis
 * ou criar uma nova família
 */
const FamilySelector: React.FC<FamilySelectorProps> = ({ className = '' }) => {
  const { 
    families, 
    selectedFamily, 
    loading, 
    error, 
    selectFamily, 
    createFamily 
  } = useFamily();
  
  const [isCreating, setIsCreating] = useState(false);
  const [newFamilyName, setNewFamilyName] = useState('');
  const [createError, setCreateError] = useState<string | null>(null);

  // Handler para mudança de família
  const handleFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const familyId = parseInt(e.target.value);
    
    if (familyId === -1) {
      // Opção para criar nova família
      setIsCreating(true);
    } else {
      selectFamily(familyId);
    }
  };

  // Handler para submissão do formulário de nova família
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newFamilyName.trim()) {
      setCreateError('O nome da família é obrigatório');
      return;
    }
    
    try {
      await createFamily(newFamilyName);
      setNewFamilyName('');
      setIsCreating(false);
      setCreateError(null);
    } catch (err) {
      setCreateError('Erro ao criar família');
      console.error(err);
    }
  };

  // Handler para cancelar criação de família
  const handleCancelCreate = () => {
    setIsCreating(false);
    setNewFamilyName('');
    setCreateError(null);
  };

  // Renderiza o formulário de criação de família
  const renderCreateForm = () => (
    <form onSubmit={handleCreateSubmit} className="mt-2">
      <div className="flex flex-col space-y-2">
        <label htmlFor="newFamilyName" className="text-sm font-medium">
          Nome da nova família
        </label>
        <input
          id="newFamilyName"
          type="text"
          value={newFamilyName}
          onChange={(e) => setNewFamilyName(e.target.value)}
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Digite o nome da família"
        />
        {createError && (
          <p className="text-sm text-red-600">{createError}</p>
        )}
        <div className="flex space-x-2">
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Criar
          </button>
          <button
            type="button"
            onClick={handleCancelCreate}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancelar
          </button>
        </div>
      </div>
    </form>
  );

  // Renderiza o seletor de família
  const renderFamilySelector = () => (
    <div className="flex flex-col space-y-1">
      <label htmlFor="familySelector" className="text-sm font-medium">
        Família
      </label>
      <select
        id="familySelector"
        value={selectedFamily?.id || ''}
        onChange={handleFamilyChange}
        className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={loading}
      >
        {!selectedFamily && <option value="">Selecione uma família</option>}
        {families.map((family: Family) => (
          <option key={family.id} value={family.id}>
            {family.name}
          </option>
        ))}
        <option value={-1}>+ Criar nova família</option>
      </select>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );

  return (
    <div className={`family-selector ${className}`}>
      {renderFamilySelector()}
      {isCreating && renderCreateForm()}
    </div>
  );
};

export default FamilySelector;