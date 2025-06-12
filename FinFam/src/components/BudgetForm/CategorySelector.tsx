import React, { useState } from 'react';
import { Select } from '../UI/Select';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';
import { Card, CardContent } from '../UI/Card';

interface CategorySelectorProps {
  value: string;
  onChange: (category: string) => void;
  predefinedCategories?: string[];
  allowCustom?: boolean;
}

const defaultCategories = [
  'Alimentação',
  'Moradia',
  'Transporte',
  'Saúde',
  'Educação',
  'Lazer',
  'Vestuário',
  'Utilidades',
  'Poupança',
  'Investimentos',
  'Dívidas',
  'Presentes',
  'Doações',
  'Outros'
];

const CategorySelector: React.FC<CategorySelectorProps> = ({
  value,
  onChange,
  predefinedCategories = defaultCategories,
  allowCustom = true
}) => {
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [recentCategories, setRecentCategories] = useState<string[]>([]);

  // Combinar categorias predefinidas com categorias recentes
  const categoriesSet = new Set<string>();
  predefinedCategories.forEach(category => categoriesSet.add(category));
  recentCategories.forEach(category => categoriesSet.add(category));
  const allCategories = Array.from(categoriesSet);

  // Adicionar categoria personalizada
  const handleAddCustomCategory = () => {
    if (customCategory.trim() === '') return;
    
    // Adicionar à lista de categorias recentes
    setRecentCategories(prev => {
      if (prev.includes(customCategory)) return prev;
      return [...prev, customCategory];
    });
    
    // Definir como valor selecionado
    onChange(customCategory);
    
    // Limpar e fechar o formulário
    setCustomCategory('');
    setIsAddingCustom(false);
  };

  return (
    <div className="space-y-2">
      {!isAddingCustom ? (
        <div className="space-y-2">
          <Select
            label="Categoria"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            options={[
              { value: '', label: 'Selecione uma categoria', disabled: true },
              ...allCategories.map(category => ({ 
                value: category, 
                label: category 
              }))
            ]}
            required
          />
          
          {allowCustom && (
            <div className="flex justify-end">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsAddingCustom(true)}
              >
                + Adicionar categoria personalizada
              </Button>
            </div>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="p-4">
            <h4 className="text-sm font-medium mb-2">Nova Categoria</h4>
            <div className="flex space-x-2">
              <Input
                placeholder="Nome da categoria"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleAddCustomCategory}>
                Adicionar
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => {
                  setCustomCategory('');
                  setIsAddingCustom(false);
                }}
              >
                Cancelar
              </Button>
            </div>
            
            {/* Sugestões de categorias populares */}
            {predefinedCategories.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Sugestões:
                </p>
                <div className="flex flex-wrap gap-1">
                  {predefinedCategories.slice(0, 8).map((category) => (
                    <Button
                      key={category}
                      variant="outline"
                      size="xs"
                      onClick={() => {
                        setCustomCategory(category);
                      }}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CategorySelector;