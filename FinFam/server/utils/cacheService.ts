import NodeCache from 'node-cache';
import { info, debug } from './logger';

/**
 * Serviço de cache para armazenar resultados de consultas frequentes
 * 
 * Este serviço utiliza o node-cache para armazenar em memória os resultados
 * de consultas frequentes, reduzindo a carga no banco de dados e melhorando
 * o tempo de resposta da aplicação.
 */
class CacheService {
  private cache: NodeCache;
  private readonly defaultTTL: number = 300; // 5 minutos em segundos

  /**
   * Cria uma nova instância do serviço de cache
   * 
   * @param {number} stdTTL - Tempo de vida padrão dos itens em cache (em segundos)
   * @param {number} checkperiod - Intervalo para verificar itens expirados (em segundos)
   */
  constructor(stdTTL: number = 300, checkperiod: number = 120) {
    this.cache = new NodeCache({
      stdTTL,
      checkperiod,
      useClones: false, // Para melhor performance
    });

    // Registrar eventos de expiração para logging
    this.cache.on('expired', (key, value) => {
      debug(`Cache expirado: ${key}`);
    });

    info('Serviço de cache inicializado', { stdTTL, checkperiod });
  }

  /**
   * Obtém um valor do cache
   * 
   * @param {string} key - Chave do item no cache
   * @returns {T | undefined} - Valor armazenado ou undefined se não encontrado
   */
  get<T>(key: string): T | undefined {
    const value = this.cache.get<T>(key);
    
    if (value === undefined) {
      debug(`Cache miss: ${key}`);
      return undefined;
    }
    
    debug(`Cache hit: ${key}`);
    return value;
  }

  /**
   * Armazena um valor no cache
   * 
   * @param {string} key - Chave para armazenar o valor
   * @param {T} value - Valor a ser armazenado
   * @param {number} ttl - Tempo de vida em segundos (opcional)
   * @returns {boolean} - true se armazenado com sucesso, false caso contrário
   */
  set<T>(key: string, value: T, ttl: number = this.defaultTTL): boolean {
    const result = this.cache.set(key, value, ttl);
    debug(`Cache set: ${key}`, { ttl });
    return result;
  }

  /**
   * Remove um valor do cache
   * 
   * @param {string} key - Chave do item a ser removido
   * @returns {number} - Número de itens removidos (0 ou 1)
   */
  del(key: string): number {
    const result = this.cache.del(key);
    debug(`Cache delete: ${key}`);
    return result;
  }

  /**
   * Verifica se uma chave existe no cache
   * 
   * @param {string} key - Chave a ser verificada
   * @returns {boolean} - true se a chave existe, false caso contrário
   */
  has(key: string): boolean {
    return this.cache.has(key);
  }

  /**
   * Limpa todo o cache
   * 
   * @returns {void}
   */
  flush(): void {
    this.cache.flushAll();
    info('Cache limpo completamente');
  }

  /**
   * Obtém estatísticas do cache
   * 
   * @returns {NodeCache.Stats} - Estatísticas do cache
   */
  getStats(): NodeCache.Stats {
    return this.cache.getStats();
  }

  /**
   * Função auxiliar para obter um valor do cache ou executar uma função
   * para obter o valor e armazená-lo no cache
   * 
   * @param {string} key - Chave do item no cache
   * @param {Function} fn - Função para obter o valor se não estiver no cache
   * @param {number} ttl - Tempo de vida em segundos (opcional)
   * @returns {Promise<T>} - Valor do cache ou resultado da função
   */
  async getOrSet<T>(key: string, fn: () => Promise<T>, ttl: number = this.defaultTTL): Promise<T> {
    const cachedValue = this.get<T>(key);
    
    if (cachedValue !== undefined) {
      return cachedValue;
    }
    
    try {
      const value = await fn();
      this.set(key, value, ttl);
      return value;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Invalida todas as chaves que começam com um determinado prefixo
   * 
   * @param {string} prefix - Prefixo das chaves a serem invalidadas
   * @returns {number} - Número de itens removidos
   */
  invalidateByPrefix(prefix: string): number {
    const keys = this.cache.keys().filter(key => key.startsWith(prefix));
    const count = keys.length;
    
    if (count > 0) {
      this.cache.del(keys);
      info(`Invalidados ${count} itens do cache com prefixo: ${prefix}`);
    }
    
    return count;
  }
}

// Exporta uma instância singleton do serviço de cache
export const cacheService = new CacheService();

export default cacheService;