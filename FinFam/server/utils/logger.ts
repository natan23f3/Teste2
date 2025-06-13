import winston from 'winston';
import path from 'path';
import fs from 'fs';

// Certifique-se de que o diretório de logs existe
const logDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Configuração de formatos personalizados
const { combine, timestamp, printf, colorize, json } = winston.format;

// Formato para logs de console
const consoleFormat = combine(
  colorize(),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  printf(({ level, message, timestamp, ...meta }) => {
    return `${timestamp} ${level}: ${message} ${
      Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
    }`;
  })
);

// Formato para logs de arquivo
const fileFormat = combine(
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  json()
);

// Níveis de log personalizados
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Determinar o nível de log com base no ambiente
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  return env === 'development' ? 'debug' : 'http';
};

// Criar a instância do logger
const logger = winston.createLogger({
  level: level(),
  levels,
  format: fileFormat,
  transports: [
    // Logs de erro são armazenados em um arquivo separado
    new winston.transports.File({ 
      filename: path.join(logDir, 'error.log'), 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Logs combinados são armazenados em um arquivo separado
    new winston.transports.File({ 
      filename: path.join(logDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
  exceptionHandlers: [
    // Exceções não tratadas são registradas em um arquivo separado
    new winston.transports.File({ 
      filename: path.join(logDir, 'exceptions.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
  rejectionHandlers: [
    // Promessas rejeitadas não tratadas são registradas em um arquivo separado
    new winston.transports.File({ 
      filename: path.join(logDir, 'rejections.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
  exitOnError: false, // Não sair em caso de erro de manipulador
});

// Adicionar transporte de console em ambiente de desenvolvimento
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: consoleFormat,
    })
  );
}

/**
 * Registra uma mensagem de log
 * 
 * @param {string} level - Nível de log (error, warn, info, http, debug)
 * @param {string} message - Mensagem de log
 * @param {object} meta - Metadados adicionais
 */
export const log = (level: string, message: string, meta: object = {}) => {
  logger.log(level, message, meta);
};

/**
 * Registra uma mensagem de erro
 * 
 * @param {string} message - Mensagem de erro
 * @param {object} meta - Metadados adicionais
 */
export const error = (message: string, meta: object = {}) => {
  logger.error(message, meta);
};

/**
 * Registra uma mensagem de aviso
 * 
 * @param {string} message - Mensagem de aviso
 * @param {object} meta - Metadados adicionais
 */
export const warn = (message: string, meta: object = {}) => {
  logger.warn(message, meta);
};

/**
 * Registra uma mensagem informativa
 * 
 * @param {string} message - Mensagem informativa
 * @param {object} meta - Metadados adicionais
 */
export const info = (message: string, meta: object = {}) => {
  logger.info(message, meta);
};

/**
 * Registra uma mensagem de requisição HTTP
 * 
 * @param {string} message - Mensagem de requisição HTTP
 * @param {object} meta - Metadados adicionais
 */
export const http = (message: string, meta: object = {}) => {
  logger.http(message, meta);
};

/**
 * Registra uma mensagem de depuração
 * 
 * @param {string} message - Mensagem de depuração
 * @param {object} meta - Metadados adicionais
 */
export const debug = (message: string, meta: object = {}) => {
  logger.debug(message, meta);
};

export default {
  log,
  error,
  warn,
  info,
  http,
  debug,
};