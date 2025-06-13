import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { info, error } from '../utils/logger';

/**
 * Tipos de eventos de socket
 */
export enum SocketEvents {
  // Eventos de conexão
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  
  // Eventos de autenticação
  AUTHENTICATE = 'authenticate',
  AUTHENTICATED = 'authenticated',
  
  // Eventos de família
  JOIN_FAMILY = 'join_family',
  LEAVE_FAMILY = 'leave_family',
  
  // Eventos de notificação
  NOTIFICATION = 'notification',
  
  // Eventos de orçamento
  BUDGET_CREATED = 'budget_created',
  BUDGET_UPDATED = 'budget_updated',
  BUDGET_DELETED = 'budget_deleted',
  BUDGET_SHARED = 'budget_shared',
  
  // Eventos de despesa
  EXPENSE_CREATED = 'expense_created',
  EXPENSE_UPDATED = 'expense_updated',
  EXPENSE_DELETED = 'expense_deleted',
  
  // Eventos de meta
  GOAL_PROGRESS_UPDATED = 'goal_progress_updated',
  GOAL_COMPLETED = 'goal_completed',
}

/**
 * Interface para dados de notificação
 */
export interface NotificationData {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  data?: any;
}

/**
 * Serviço de WebSockets para notificações em tempo real
 */
class SocketService {
  private io: Server | null = null;
  private userSockets: Map<number, Set<string>> = new Map();
  private familySockets: Map<number, Set<string>> = new Map();
  
  /**
   * Inicializa o serviço de WebSockets
   * 
   * @param {HttpServer} server - Servidor HTTP
   */
  initialize(server: HttpServer): void {
    this.io = new Server(server, {
      cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true
      }
    });
    
    this.io.on(SocketEvents.CONNECT, this.handleConnection.bind(this));
    
    info('Serviço de WebSockets inicializado');
  }
  
  /**
   * Manipula uma nova conexão de socket
   * 
   * @param {Socket} socket - Socket do cliente
   */
  private handleConnection(socket: Socket): void {
    info(`Nova conexão de socket: ${socket.id}`);
    
    // Evento de autenticação
    socket.on(SocketEvents.AUTHENTICATE, (data: { userId: number }) => {
      this.authenticateUser(socket, data.userId);
    });
    
    // Evento para entrar em uma sala de família
    socket.on(SocketEvents.JOIN_FAMILY, (data: { familyId: number }) => {
      this.joinFamilyRoom(socket, data.familyId);
    });
    
    // Evento para sair de uma sala de família
    socket.on(SocketEvents.LEAVE_FAMILY, (data: { familyId: number }) => {
      this.leaveFamilyRoom(socket, data.familyId);
    });
    
    // Evento de desconexão
    socket.on(SocketEvents.DISCONNECT, () => {
      this.handleDisconnect(socket);
    });
  }
  
  /**
   * Autentica um usuário e associa seu ID ao socket
   * 
   * @param {Socket} socket - Socket do cliente
   * @param {number} userId - ID do usuário
   */
  private authenticateUser(socket: Socket, userId: number): void {
    // Armazenar o ID do usuário no socket
    socket.data.userId = userId;
    
    // Adicionar o socket à lista de sockets do usuário
    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set());
    }
    this.userSockets.get(userId)?.add(socket.id);
    
    // Entrar na sala do usuário
    socket.join(`user:${userId}`);
    
    // Emitir evento de autenticação bem-sucedida
    socket.emit(SocketEvents.AUTHENTICATED, { userId });
    
    info(`Usuário autenticado: ${userId}, Socket: ${socket.id}`);
  }
  
  /**
   * Adiciona um socket à sala de uma família
   * 
   * @param {Socket} socket - Socket do cliente
   * @param {number} familyId - ID da família
   */
  private joinFamilyRoom(socket: Socket, familyId: number): void {
    // Verificar se o usuário está autenticado
    if (!socket.data.userId) {
      socket.emit('error', { message: 'Não autenticado' });
      return;
    }
    
    // Entrar na sala da família
    socket.join(`family:${familyId}`);
    
    // Adicionar o socket à lista de sockets da família
    if (!this.familySockets.has(familyId)) {
      this.familySockets.set(familyId, new Set());
    }
    this.familySockets.get(familyId)?.add(socket.id);
    
    info(`Socket ${socket.id} entrou na sala da família ${familyId}`);
  }
  
  /**
   * Remove um socket da sala de uma família
   * 
   * @param {Socket} socket - Socket do cliente
   * @param {number} familyId - ID da família
   */
  private leaveFamilyRoom(socket: Socket, familyId: number): void {
    // Sair da sala da família
    socket.leave(`family:${familyId}`);
    
    // Remover o socket da lista de sockets da família
    this.familySockets.get(familyId)?.delete(socket.id);
    
    info(`Socket ${socket.id} saiu da sala da família ${familyId}`);
  }
  
  /**
   * Manipula a desconexão de um socket
   * 
   * @param {Socket} socket - Socket do cliente
   */
  private handleDisconnect(socket: Socket): void {
    const userId = socket.data.userId;
    
    if (userId) {
      // Remover o socket da lista de sockets do usuário
      this.userSockets.get(userId)?.delete(socket.id);
      
      // Se não houver mais sockets para o usuário, remover o usuário da lista
      if (this.userSockets.get(userId)?.size === 0) {
        this.userSockets.delete(userId);
      }
    }
    
    // Remover o socket de todas as listas de sockets de família
    for (const [familyId, sockets] of this.familySockets.entries()) {
      if (sockets.has(socket.id)) {
        sockets.delete(socket.id);
        
        // Se não houver mais sockets para a família, remover a família da lista
        if (sockets.size === 0) {
          this.familySockets.delete(familyId);
        }
      }
    }
    
    info(`Socket desconectado: ${socket.id}`);
  }
  
  /**
   * Envia uma notificação para um usuário específico
   * 
   * @param {number} userId - ID do usuário
   * @param {NotificationData} notification - Dados da notificação
   */
  sendNotificationToUser(userId: number, notification: NotificationData): void {
    if (!this.io) {
      error('Tentativa de enviar notificação sem inicializar o serviço de WebSockets');
      return;
    }
    
    this.io.to(`user:${userId}`).emit(SocketEvents.NOTIFICATION, notification);
    info(`Notificação enviada para o usuário ${userId}`, { notificationId: notification.id });
  }
  
  /**
   * Envia uma notificação para todos os membros de uma família
   * 
   * @param {number} familyId - ID da família
   * @param {NotificationData} notification - Dados da notificação
   */
  sendNotificationToFamily(familyId: number, notification: NotificationData): void {
    if (!this.io) {
      error('Tentativa de enviar notificação sem inicializar o serviço de WebSockets');
      return;
    }
    
    this.io.to(`family:${familyId}`).emit(SocketEvents.NOTIFICATION, notification);
    info(`Notificação enviada para a família ${familyId}`, { notificationId: notification.id });
  }
  
  /**
   * Notifica sobre a criação de um orçamento
   * 
   * @param {number} familyId - ID da família
   * @param {any} budget - Dados do orçamento
   */
  notifyBudgetCreated(familyId: number, budget: any): void {
    if (!this.io) {
      error('Tentativa de enviar notificação sem inicializar o serviço de WebSockets');
      return;
    }
    
    this.io.to(`family:${familyId}`).emit(SocketEvents.BUDGET_CREATED, budget);
    info(`Notificação de orçamento criado enviada para a família ${familyId}`, { budgetId: budget.id });
  }
  
  /**
   * Notifica sobre a atualização de um orçamento
   * 
   * @param {number} familyId - ID da família
   * @param {any} budget - Dados do orçamento
   */
  notifyBudgetUpdated(familyId: number, budget: any): void {
    if (!this.io) {
      error('Tentativa de enviar notificação sem inicializar o serviço de WebSockets');
      return;
    }
    
    this.io.to(`family:${familyId}`).emit(SocketEvents.BUDGET_UPDATED, budget);
    info(`Notificação de orçamento atualizado enviada para a família ${familyId}`, { budgetId: budget.id });
  }
  
  /**
   * Notifica sobre a exclusão de um orçamento
   * 
   * @param {number} familyId - ID da família
   * @param {number} budgetId - ID do orçamento
   */
  notifyBudgetDeleted(familyId: number, budgetId: number): void {
    if (!this.io) {
      error('Tentativa de enviar notificação sem inicializar o serviço de WebSockets');
      return;
    }
    
    this.io.to(`family:${familyId}`).emit(SocketEvents.BUDGET_DELETED, { id: budgetId });
    info(`Notificação de orçamento excluído enviada para a família ${familyId}`, { budgetId });
  }
  
  /**
   * Notifica sobre o compartilhamento de um orçamento
   * 
   * @param {number} userId - ID do usuário que recebeu o compartilhamento
   * @param {any} budget - Dados do orçamento
   * @param {string} sharedBy - Nome de quem compartilhou
   */
  notifyBudgetShared(userId: number, budget: any, sharedBy: string): void {
    if (!this.io) {
      error('Tentativa de enviar notificação sem inicializar o serviço de WebSockets');
      return;
    }
    
    const notification: NotificationData = {
      id: `budget-shared-${Date.now()}`,
      type: 'budget_shared',
      title: 'Orçamento Compartilhado',
      message: `${sharedBy} compartilhou um orçamento com você: ${budget.category}`,
      timestamp: new Date(),
      read: false,
      data: { budget }
    };
    
    this.sendNotificationToUser(userId, notification);
  }
  
  /**
   * Notifica sobre a criação de uma despesa
   * 
   * @param {number} familyId - ID da família
   * @param {any} expense - Dados da despesa
   */
  notifyExpenseCreated(familyId: number, expense: any): void {
    if (!this.io) {
      error('Tentativa de enviar notificação sem inicializar o serviço de WebSockets');
      return;
    }
    
    this.io.to(`family:${familyId}`).emit(SocketEvents.EXPENSE_CREATED, expense);
    info(`Notificação de despesa criada enviada para a família ${familyId}`, { expenseId: expense.id });
  }
  
  /**
   * Notifica sobre a atualização de uma despesa
   * 
   * @param {number} familyId - ID da família
   * @param {any} expense - Dados da despesa
   */
  notifyExpenseUpdated(familyId: number, expense: any): void {
    if (!this.io) {
      error('Tentativa de enviar notificação sem inicializar o serviço de WebSockets');
      return;
    }
    
    this.io.to(`family:${familyId}`).emit(SocketEvents.EXPENSE_UPDATED, expense);
    info(`Notificação de despesa atualizada enviada para a família ${familyId}`, { expenseId: expense.id });
  }
  
  /**
   * Notifica sobre a exclusão de uma despesa
   * 
   * @param {number} familyId - ID da família
   * @param {number} expenseId - ID da despesa
   */
  notifyExpenseDeleted(familyId: number, expenseId: number): void {
    if (!this.io) {
      error('Tentativa de enviar notificação sem inicializar o serviço de WebSockets');
      return;
    }
    
    this.io.to(`family:${familyId}`).emit(SocketEvents.EXPENSE_DELETED, { id: expenseId });
    info(`Notificação de despesa excluída enviada para a família ${familyId}`, { expenseId });
  }
}

// Exporta uma instância singleton do serviço de WebSockets
export const socketService = new SocketService();

export default socketService;