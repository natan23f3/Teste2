import React from 'react';
import { useNavigate, useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { Button } from '../components/UI/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/UI/Card';

interface ErrorPageProps {
  title?: string;
  message?: string;
  showHomeButton?: boolean;
  showBackButton?: boolean;
}

const ErrorPage: React.FC<ErrorPageProps> = ({
  title,
  message,
  showHomeButton = true,
  showBackButton = true,
}) => {
  const navigate = useNavigate();
  const error = useRouteError();
  
  // Determina o status e a mensagem com base no erro da rota
  let status = '500';
  let errorMessage = 'Ocorreu um erro inesperado.';
  
  if (isRouteErrorResponse(error)) {
    status = error.status.toString();
    errorMessage = error.statusText || error.data?.message || errorMessage;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  }
  
  // Determina o título com base no status
  let errorTitle = title || 'Erro';
  if (!title) {
    switch (status) {
      case '404':
        errorTitle = 'Página não encontrada';
        errorMessage = message || 'A página que você está procurando não existe.';
        break;
      case '403':
        errorTitle = 'Acesso negado';
        errorMessage = message || 'Você não tem permissão para acessar esta página.';
        break;
      case '401':
        errorTitle = 'Não autorizado';
        errorMessage = message || 'Você precisa fazer login para acessar esta página.';
        break;
      default:
        errorTitle = 'Erro no servidor';
        errorMessage = message || 'Ocorreu um erro inesperado. Tente novamente mais tarde.';
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader variant="danger">
          <CardTitle>{errorTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-red-600 dark:text-red-400 mb-6">
              {status === '404' ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-24 w-24 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-24 w-24 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              )}
            </div>
            <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-2">
              {status}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {errorMessage}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
          {showBackButton && (
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              leftIcon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              }
            >
              Voltar
            </Button>
          )}
          {showHomeButton && (
            <Button
              variant="primary"
              onClick={() => navigate('/')}
              leftIcon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              }
            >
              Ir para a página inicial
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

// Componentes de erro específicos
export const NotFoundPage: React.FC = () => (
  <ErrorPage
    title="Página não encontrada"
    message="A página que você está procurando não existe ou foi movida."
  />
);

export const ForbiddenPage: React.FC = () => (
  <ErrorPage
    title="Acesso negado"
    message="Você não tem permissão para acessar esta página."
  />
);

export const UnauthorizedPage: React.FC = () => (
  <ErrorPage
    title="Não autorizado"
    message="Você precisa fazer login para acessar esta página."
  />
);

export const ServerErrorPage: React.FC = () => (
  <ErrorPage
    title="Erro no servidor"
    message="Ocorreu um erro inesperado no servidor. Tente novamente mais tarde."
  />
);

export default ErrorPage;