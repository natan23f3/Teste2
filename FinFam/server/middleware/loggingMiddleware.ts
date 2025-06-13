import { Request, Response, NextFunction } from 'express';
import { http, error } from '../utils/logger';

/**
 * Middleware para logging de requisições HTTP
 * 
 * Registra informações sobre cada requisição HTTP, incluindo:
 * - Método HTTP
 * - URL
 * - Status da resposta
 * - Tempo de resposta
 * - IP do cliente
 * - User-Agent
 * 
 * @param {Request} req - Objeto de requisição Express
 * @param {Response} res - Objeto de resposta Express
 * @param {NextFunction} next - Função next do Express
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  // Captura o tempo de início da requisição
  const start = Date.now();
  
  // Armazena o método e URL originais para logging
  const { method, originalUrl, ip } = req;
  const userAgent = req.get('user-agent') || 'unknown';
  
  // Função para registrar a resposta
  const logResponse = () => {
    // Calcula o tempo de resposta
    const responseTime = Date.now() - start;
    
    // Registra a requisição
    http(`${method} ${originalUrl}`, {
      method,
      url: originalUrl,
      status: res.statusCode,
      responseTime: `${responseTime}ms`,
      ip,
      userAgent,
      userId: req.user?.id || 'unauthenticated',
    });
    
    // Remove os listeners para evitar vazamento de memória
    res.removeListener('finish', logResponse);
    res.removeListener('close', logResponse);
    res.removeListener('error', logError);
  };
  
  // Função para registrar erros
  const logError = (err: Error) => {
    error(`${method} ${originalUrl} - Error`, {
      method,
      url: originalUrl,
      error: err.message,
      stack: err.stack,
      ip,
      userAgent,
      userId: req.user?.id || 'unauthenticated',
    });
    
    // Remove os listeners para evitar vazamento de memória
    res.removeListener('finish', logResponse);
    res.removeListener('close', logResponse);
    res.removeListener('error', logError);
  };
  
  // Adiciona listeners para capturar o final da requisição
  res.on('finish', logResponse);
  res.on('close', logResponse);
  res.on('error', logError);
  
  next();
};

/**
 * Middleware para monitoramento de performance
 * 
 * Monitora o tempo de execução de cada requisição e registra
 * alertas para requisições que excedem um limite de tempo.
 * 
 * @param {number} threshold - Limite de tempo em ms (padrão: 1000ms)
 * @returns {Function} Middleware Express
 */
export const performanceMonitor = (threshold = 1000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    
    // Função para verificar o tempo de resposta
    const checkPerformance = () => {
      const duration = Date.now() - start;
      
      // Se a duração exceder o limite, registra um aviso
      if (duration > threshold) {
        http(`Requisição lenta: ${req.method} ${req.originalUrl}`, {
          method: req.method,
          url: req.originalUrl,
          duration: `${duration}ms`,
          threshold: `${threshold}ms`,
          userId: req.user?.id || 'unauthenticated',
        });
      }
      
      // Remove os listeners para evitar vazamento de memória
      res.removeListener('finish', checkPerformance);
      res.removeListener('close', checkPerformance);
    };
    
    // Adiciona listeners para capturar o final da requisição
    res.on('finish', checkPerformance);
    res.on('close', checkPerformance);
    
    next();
  };
};

/**
 * Middleware para rastreamento de erros
 * 
 * Captura erros não tratados e os registra no sistema de logging.
 * 
 * @param {Error} err - Objeto de erro
 * @param {Request} req - Objeto de requisição Express
 * @param {Response} res - Objeto de resposta Express
 * @param {NextFunction} next - Função next do Express
 */
export const errorTracker = (err: any, req: Request, res: Response, next: NextFunction) => {
  // Registra o erro
  error('Erro não tratado', {
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('user-agent') || 'unknown',
    userId: req.user?.id || 'unauthenticated',
    body: req.body,
    query: req.query,
    params: req.params,
  });
  
  // Passa o erro para o próximo middleware
  next(err);
};

export default {
  requestLogger,
  performanceMonitor,
  errorTracker,
};