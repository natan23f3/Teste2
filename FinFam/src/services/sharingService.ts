import { Budget } from './budgetService';
import { socketService } from '../../server/services/socketService';
import { error, info } from '../../server/utils/logger';

/**
 * Interface para dados de compartilhamento
 */
interface SharingData {
  budgetId: number;
  sharedBy: number;
  sharedByName: string;
  sharedWith: number[];
  message?: string;
  timestamp: Date;
}

/**
 * Serviço para compartilhamento de orçamentos entre usuários
 */
class SharingService {
  private sharedBudgets: Map<number, SharingData[]> = new Map();
  
  /**
   * Compartilha um orçamento com outros usuários
   * 
   * @param {Budget} budget - Orçamento a ser compartilhado
   * @param {number} sharedBy - ID do usuário que está compartilhando
   * @param {string} sharedByName - Nome do usuário que está compartilhando
   * @param {number[]} sharedWith - IDs dos usuários com quem compartilhar
   * @param {string} message - Mensagem opcional
   * @returns {boolean} - true se o compartilhamento foi bem-sucedido
   */
  shareBudget(
    budget: Budget,
    sharedBy: number,
    sharedByName: string,
    sharedWith: number[],
    message?: string
  ): boolean {
    try {
      // Criar dados de compartilhamento
      const sharingData: SharingData = {
        budgetId: budget.id,
        sharedBy,
        sharedByName,
        sharedWith,
        message,
        timestamp: new Date()
      };
      
      // Armazenar dados de compartilhamento
      if (!this.sharedBudgets.has(budget.id)) {
        this.sharedBudgets.set(budget.id, []);
      }
      this.sharedBudgets.get(budget.id)?.push(sharingData);
      
      // Notificar usuários sobre o compartilhamento
      sharedWith.forEach(userId => {
        try {
          // Enviar notificação via WebSocket
          socketService.notifyBudgetShared(userId, budget, sharedByName);
        } catch (err) {
          error(`Erro ao notificar usuário ${userId} sobre compartilhamento de orçamento`, {
            error: err,
            budgetId: budget.id,
            sharedBy,
            userId
          });
        }
      });
      
      info(`Orçamento ${budget.id} compartilhado por ${sharedBy} com ${sharedWith.length} usuários`);
      return true;
    } catch (err) {
      error('Erro ao compartilhar orçamento', {
        error: err,
        budgetId: budget.id,
        sharedBy,
        sharedWith
      });
      return false;
    }
  }
  
  /**
   * Obtém orçamentos compartilhados com um usuário
   * 
   * @param {number} userId - ID do usuário
   * @returns {Array<{budget: Budget, sharedBy: string, timestamp: Date, message?: string}>} - Lista de orçamentos compartilhados
   */
  getSharedBudgetsForUser(userId: number): Array<{budget: Budget, sharedBy: string, timestamp: Date, message?: string}> {
    const sharedBudgets: Array<{budget: Budget, sharedBy: string, timestamp: Date, message?: string}> = [];
    
    // Percorrer todos os orçamentos compartilhados
    this.sharedBudgets.forEach((sharingDataList, budgetId) => {
      // Filtrar compartilhamentos para o usuário específico
      const userShares = sharingDataList.filter(data => data.sharedWith.includes(userId));
      
      // Adicionar orçamentos compartilhados à lista
      userShares.forEach(share => {
        // Aqui, você precisaria buscar o orçamento completo do banco de dados
        // Para este exemplo, estamos assumindo que temos acesso ao orçamento
        const budget = {
          id: budgetId,
          // Outros campos do orçamento seriam preenchidos aqui
        } as Budget;
        
        sharedBudgets.push({
          budget,
          sharedBy: share.sharedByName,
          timestamp: share.timestamp,
          message: share.message
        });
      });
    });
    
    // Ordenar por data de compartilhamento (mais recente primeiro)
    return sharedBudgets.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
  
  /**
   * Verifica se um usuário tem acesso a um orçamento compartilhado
   * 
   * @param {number} budgetId - ID do orçamento
   * @param {number} userId - ID do usuário
   * @returns {boolean} - true se o usuário tem acesso ao orçamento
   */
  hasAccessToSharedBudget(budgetId: number, userId: number): boolean {
    const sharingDataList = this.sharedBudgets.get(budgetId);
    
    if (!sharingDataList) {
      return false;
    }
    
    return sharingDataList.some(data => data.sharedWith.includes(userId));
  }
  
  /**
   * Remove o compartilhamento de um orçamento com um usuário
   * 
   * @param {number} budgetId - ID do orçamento
   * @param {number} sharedBy - ID do usuário que compartilhou
   * @param {number} userId - ID do usuário com quem o compartilhamento será removido
   * @returns {boolean} - true se o compartilhamento foi removido com sucesso
   */
  removeSharing(budgetId: number, sharedBy: number, userId: number): boolean {
    try {
      const sharingDataList = this.sharedBudgets.get(budgetId);
      
      if (!sharingDataList) {
        return false;
      }
      
      // Encontrar o compartilhamento específico
      const sharingIndex = sharingDataList.findIndex(data => 
        data.sharedBy === sharedBy && data.sharedWith.includes(userId)
      );
      
      if (sharingIndex === -1) {
        return false;
      }
      
      // Remover o usuário da lista de compartilhamento
      const sharingData = sharingDataList[sharingIndex];
      sharingData.sharedWith = sharingData.sharedWith.filter(id => id !== userId);
      
      // Se não houver mais usuários, remover o compartilhamento
      if (sharingData.sharedWith.length === 0) {
        sharingDataList.splice(sharingIndex, 1);
      }
      
      // Se não houver mais compartilhamentos para este orçamento, remover a entrada
      if (sharingDataList.length === 0) {
        this.sharedBudgets.delete(budgetId);
      }
      
      info(`Compartilhamento do orçamento ${budgetId} removido para o usuário ${userId}`);
      return true;
    } catch (err) {
      error('Erro ao remover compartilhamento de orçamento', {
        error: err,
        budgetId,
        sharedBy,
        userId
      });
      return false;
    }
  }
  
  /**
   * Obtém usuários com quem um orçamento foi compartilhado
   * 
   * @param {number} budgetId - ID do orçamento
   * @param {number} sharedBy - ID do usuário que compartilhou
   * @returns {number[]} - Lista de IDs de usuários
   */
  getSharedWithUsers(budgetId: number, sharedBy: number): number[] {
    const sharingDataList = this.sharedBudgets.get(budgetId);
    
    if (!sharingDataList) {
      return [];
    }
    
    // Encontrar o compartilhamento específico
    const sharingData = sharingDataList.find(data => data.sharedBy === sharedBy);
    
    if (!sharingData) {
      return [];
    }
    
    return [...sharingData.sharedWith];
  }
}

// Exporta uma instância singleton do serviço de compartilhamento
export const sharingService = new SharingService();

export default sharingService;