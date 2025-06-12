import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../UI/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../UI/Table';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { Select } from '../UI/Select';
import { Pagination } from '../UI/Pagination';
import { Goal } from './GoalForm';

interface GoalListProps {
  goals: Goal[];
  isLoading: boolean;
  onViewDetail: (goal: Goal) => void;
  onEdit: (goal: Goal) => void;
  onDelete: (goalId: number) => void;
}

const GoalList: React.FC<GoalListProps> = ({
  goals,
  isLoading,
  onViewDetail,
  onEdit,
  onDelete
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [sortBy, setSortBy] = useState('deadline');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  const itemsPerPage = 10;

  // Obter categorias únicas
  const categoriesSet = new Set<string>();
  goals.forEach(goal => categoriesSet.add(goal.category));
  const categories = Array.from(categoriesSet);

  // Filtrar e ordenar metas
  const filteredGoals = goals
    .filter(goal => {
      const nameMatch = !searchTerm || 
        goal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        goal.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const categoryMatch = selectedCategory === 'all' || goal.category === selectedCategory;
      const priorityMatch = selectedPriority === 'all' || goal.priority === selectedPriority;
      
      return nameMatch && categoryMatch && priorityMatch;
    })
    .sort((a, b) => {
      // Ordenação
      if (sortBy === 'name') {
        return sortOrder === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === 'target') {
        return sortOrder === 'asc' ? a.target - b.target : b.target - a.target;
      } else if (sortBy === 'current') {
        return sortOrder === 'asc' ? a.current - b.current : b.current - a.current;
      } else if (sortBy === 'progress') {
        const progressA = (a.current / a.target) * 100;
        const progressB = (b.current / b.target) * 100;
        return sortOrder === 'asc' ? progressA - progressB : progressB - progressA;
      } else if (sortBy === 'deadline') {
        const dateA = new Date(a.deadline).getTime();
        const dateB = new Date(b.deadline).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      } else if (sortBy === 'priority') {
        const priorityOrder = { 'Baixa': 1, 'Média': 2, 'Alta': 3 };
        return sortOrder === 'asc' 
          ? priorityOrder[a.priority] - priorityOrder[b.priority]
          : priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return 0;
    });

  // Paginação
  const totalPages = Math.ceil(filteredGoals.length / itemsPerPage);
  const paginatedGoals = filteredGoals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Alternar ordem de classificação
  const toggleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // Renderizar seta de ordenação
  const renderSortArrow = (column: string) => {
    if (sortBy !== column) return null;
    
    return sortOrder === 'asc' ? (
      <span className="ml-1">↑</span>
    ) : (
      <span className="ml-1">↓</span>
    );
  };

  if (isLoading) {
    return <div className="animate-pulse">Carregando metas...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold">Metas Financeiras</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Input
            placeholder="Buscar por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64"
            size="sm"
          />
          <div className="flex gap-2">
            <Select
              options={[
                { value: 'all', label: 'Todas as Categorias' },
                ...categories.map(category => ({ value: category, label: category }))
              ]}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-48"
              size="sm"
            />
            <Select
              options={[
                { value: 'all', label: 'Todas as Prioridades' },
                { value: 'Baixa', label: 'Baixa' },
                { value: 'Média', label: 'Média' },
                { value: 'Alta', label: 'Alta' }
              ]}
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full sm:w-48"
              size="sm"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {paginatedGoals.length > 0 ? (
          <>
            <Table hoverable striped>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer" 
                    onClick={() => toggleSort('name')}
                  >
                    Nome {renderSortArrow('name')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer" 
                    onClick={() => toggleSort('target')}
                  >
                    Valor Alvo {renderSortArrow('target')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer" 
                    onClick={() => toggleSort('current')}
                  >
                    Valor Atual {renderSortArrow('current')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer" 
                    onClick={() => toggleSort('progress')}
                  >
                    Progresso {renderSortArrow('progress')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer" 
                    onClick={() => toggleSort('deadline')}
                  >
                    Prazo {renderSortArrow('deadline')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer" 
                    onClick={() => toggleSort('priority')}
                  >
                    Prioridade {renderSortArrow('priority')}
                  </TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedGoals.map((goal) => {
                  const progress = (goal.current / goal.target) * 100;
                  const formattedDeadline = new Date(goal.deadline).toLocaleDateString('pt-BR');
                  
                  return (
                    <TableRow key={goal.id}>
                      <TableCell className="font-medium">{goal.name}</TableCell>
                      <TableCell>R$ {goal.target.toFixed(2)}</TableCell>
                      <TableCell>R$ {goal.current.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                            <div 
                              className={`h-2.5 rounded-full ${
                                progress >= 100 
                                  ? 'bg-green-600' 
                                  : progress >= 50 
                                    ? 'bg-blue-600' 
                                    : 'bg-yellow-500'
                              }`} 
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            ></div>
                          </div>
                          <span>{progress.toFixed(1)}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{formattedDeadline}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          goal.priority === 'Alta' 
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' 
                            : goal.priority === 'Média' 
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' 
                              : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        }`}>
                          {goal.priority}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="xs" 
                            onClick={() => onViewDetail(goal)}
                          >
                            Ver
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="xs" 
                            onClick={() => onEdit(goal)}
                          >
                            Editar
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="xs" 
                            onClick={() => onDelete(goal.id)}
                          >
                            Excluir
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            
            {totalPages > 1 && (
              <div className="mt-4 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Nenhuma meta encontrada com os filtros atuais.
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedPriority('all');
              }}
            >
              Limpar Filtros
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoalList;