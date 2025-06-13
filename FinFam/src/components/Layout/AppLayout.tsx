import React, { ReactNode } from 'react';
import MainNavigation from './MainNavigation';
import { Card } from '../UI/Card';

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  showHeader?: boolean;
  headerActions?: ReactNode;
  fullWidth?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  title,
  description,
  showHeader = true,
  headerActions,
  fullWidth = false,
  padding = 'lg',
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navegação principal */}
      <MainNavigation />

      {/* Conteúdo principal */}
      <main className="flex-grow">
        <div className={`mx-auto ${fullWidth ? 'w-full' : 'max-w-7xl'} px-4 sm:px-6 lg:px-8 py-6`}>
          {/* Cabeçalho da página */}
          {showHeader && (title || description || headerActions) && (
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  {title && (
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {title}
                    </h1>
                  )}
                  {description && (
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {description}
                    </p>
                  )}
                </div>
                {headerActions && (
                  <div className="mt-4 sm:mt-0 flex space-x-3 justify-start sm:justify-end">
                    {headerActions}
                  </div>
                )}
              </div>
              <div className="mt-4 border-b border-gray-200 dark:border-gray-700" />
            </div>
          )}

          {/* Conteúdo */}
          {children}
        </div>
      </main>

      {/* Rodapé */}
      <footer className="bg-white dark:bg-gray-800 shadow-sm mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              &copy; {new Date().getFullYear()} FinFam. Todos os direitos reservados.
            </div>
            <div className="mt-2 md:mt-0 text-sm text-gray-500 dark:text-gray-400">
              Versão 1.0.0
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Componente de seção para organizar o conteúdo
export const AppSection: React.FC<{
  children: ReactNode;
  title?: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}> = ({
  children,
  title,
  description,
  actions,
  className = '',
  variant = 'default',
  padding = 'md',
}) => {
  return (
    <Card
      variant={variant}
      padding={padding}
      className={`mb-6 ${className}`}
      shadow="sm"
      hover={false}
    >
      {(title || description || actions) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            {title && (
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
          {actions && (
            <div className="mt-4 sm:mt-0 flex space-x-3 justify-start sm:justify-end">
              {actions}
            </div>
          )}
        </div>
      )}
      {children}
    </Card>
  );
};

export default AppLayout;