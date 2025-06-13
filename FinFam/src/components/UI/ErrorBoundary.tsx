import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './Card';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetKey?: any;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Atualiza o estado para que a próxima renderização mostre a UI alternativa
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Você também pode registrar o erro em um serviço de relatório de erros
    this.setState({ errorInfo });
    
    // Chama o callback onError se fornecido
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    // Log do erro no console
    console.error('Erro capturado pelo ErrorBoundary:', error, errorInfo);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    // Se a prop resetKey mudar, reseta o estado de erro
    if (this.props.resetKey !== prevProps.resetKey && this.state.hasError) {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
      });
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Renderiza o fallback personalizado se fornecido
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Renderiza a UI de erro padrão
      return (
        <div className="flex items-center justify-center min-h-[400px] p-4">
          <Card className="w-full max-w-md">
            <CardHeader variant="danger">
              <CardTitle>Algo deu errado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-red-600 dark:text-red-400 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto mb-4"
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
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Ocorreu um erro inesperado ao renderizar este componente.
              </p>
              {this.state.error && (
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md text-sm text-red-800 dark:text-red-200 font-mono mb-4 overflow-auto max-h-40">
                  {this.state.error.toString()}
                </div>
              )}
              {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                <details className="mt-4">
                  <summary className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                    Detalhes do erro (apenas em desenvolvimento)
                  </summary>
                  <div className="mt-2 bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-xs font-mono overflow-auto max-h-60">
                    {this.state.errorInfo.componentStack}
                  </div>
                </details>
              )}
            </CardContent>
            <CardFooter>
              <Button
                variant="primary"
                onClick={this.handleReset}
                fullWidth={true}
              >
                Tentar novamente
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }

    // Se não houver erro, renderiza os filhos normalmente
    return this.props.children;
  }
}

export default ErrorBoundary;