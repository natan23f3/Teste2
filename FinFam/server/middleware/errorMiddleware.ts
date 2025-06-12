import { Request, Response, NextFunction } from 'express';

// Classe base para erros da aplicação
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Erro de validação
export class ValidationError extends AppError {
  errors: Record<string, string>;

  constructor(message: string, errors: Record<string, string>) {
    super(message, 400);
    this.errors = errors;
  }
}

// Erro de não encontrado
export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} não encontrado`, 404);
  }
}

// Erro de autorização
export class AuthorizationError extends AppError {
  constructor(message: string = 'Não autorizado') {
    super(message, 403);
  }
}

// Erro de autenticação
export class AuthenticationError extends AppError {
  constructor(message: string = 'Não autenticado') {
    super(message, 401);
  }
}

// Middleware de tratamento de erros
export const createErrorHandler = () => {
  return (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Erro:', err);

    // Se for um erro da aplicação
    if (err instanceof AppError) {
      // Erro de validação
      if (err instanceof ValidationError) {
        return res.status(err.statusCode).json({
          status: 'error',
          message: err.message,
          errors: err.errors
        });
      }

      // Outros erros da aplicação
      return res.status(err.statusCode).json({
        status: 'error',
        message: err.message
      });
    }

    // Erro não tratado
    return res.status(500).json({
      status: 'error',
      message: 'Erro interno do servidor'
    });
  };
};

// Middleware para capturar erros assíncronos
export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};