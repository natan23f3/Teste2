import request from 'supertest';
import { app } from '../../server';
import { db } from '../../server';
import { budgets } from '../../../drizzle/schema';
import { sql } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

// Mock do middleware de autenticação para os testes
jest.mock('../../middleware/authMiddleware', () => ({
  isAuthenticated: (req: any, res: any, next: any) => {
    req.user = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      role: 'admin'
    };
    next();
  }
}));

// Mock do middleware de acesso à família para os testes
jest.mock('../../middleware/familyAccessMiddleware', () => ({
  hasFamilyAccess: (req: any, res: any, next: any) => {
    req.family = {
      id: 1,
      name: 'Test Family',
      adminId: 1
    };
    next();
  }
}));

describe('Budget API Routes', () => {
  // Dados de teste
  const testBudget = {
    category: 'Alimentação',
    value: 1000,
    date: new Date().toISOString()
  };

  // Limpar a tabela de orçamentos antes de cada teste
  beforeEach(async () => {
    try {
      await db.execute(sql`DELETE FROM budgets WHERE family_id = 1`);
    } catch (error) {
      console.error('Erro ao limpar tabela de orçamentos:', error);
    }
  });

  describe('GET /api/budgets', () => {
    it('deve retornar uma lista vazia quando não há orçamentos', async () => {
      const res = await request(app).get('/api/budgets');
      
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('deve retornar uma lista de orçamentos quando existem orçamentos', async () => {
      // Inserir um orçamento de teste
      await db.insert(budgets).values({
        familyId: 1,
        category: testBudget.category,
        value: testBudget.value,
        date: new Date(testBudget.date)
      });

      const res = await request(app).get('/api/budgets');
      
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].category).toBe(testBudget.category);
      expect(res.body[0].value).toBe(testBudget.value);
    });
  });

  describe('POST /api/budgets', () => {
    it('deve criar um novo orçamento', async () => {
      const res = await request(app)
        .post('/api/budgets')
        .send(testBudget);
      
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.category).toBe(testBudget.category);
      expect(res.body.value).toBe(testBudget.value);
      expect(res.body.familyId).toBe(1);
    });

    it('deve retornar erro 400 quando dados inválidos são enviados', async () => {
      const res = await request(app)
        .post('/api/budgets')
        .send({
          // Faltando o campo category
          value: 1000,
          date: new Date().toISOString()
        });
      
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/budgets/:id', () => {
    it('deve retornar um orçamento específico', async () => {
      // Inserir um orçamento de teste
      const insertResult = await db.insert(budgets).values({
        familyId: 1,
        category: testBudget.category,
        value: testBudget.value,
        date: new Date(testBudget.date)
      }).returning();

      const budgetId = insertResult[0].id;

      const res = await request(app).get(`/api/budgets/${budgetId}`);
      
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(budgetId);
      expect(res.body.category).toBe(testBudget.category);
      expect(res.body.value).toBe(testBudget.value);
    });

    it('deve retornar erro 404 quando o orçamento não existe', async () => {
      const res = await request(app).get('/api/budgets/9999');
      
      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/budgets/:id', () => {
    it('deve atualizar um orçamento existente', async () => {
      // Inserir um orçamento de teste
      const insertResult = await db.insert(budgets).values({
        familyId: 1,
        category: testBudget.category,
        value: testBudget.value,
        date: new Date(testBudget.date)
      }).returning();

      const budgetId = insertResult[0].id;

      const updatedBudget = {
        category: 'Moradia',
        value: 2000,
        date: new Date().toISOString()
      };

      const res = await request(app)
        .put(`/api/budgets/${budgetId}`)
        .send(updatedBudget);
      
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(budgetId);
      expect(res.body.category).toBe(updatedBudget.category);
      expect(res.body.value).toBe(updatedBudget.value);
    });

    it('deve retornar erro 404 quando o orçamento não existe', async () => {
      const res = await request(app)
        .put('/api/budgets/9999')
        .send({
          category: 'Moradia',
          value: 2000,
          date: new Date().toISOString()
        });
      
      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/budgets/:id', () => {
    it('deve excluir um orçamento existente', async () => {
      // Inserir um orçamento de teste
      const insertResult = await db.insert(budgets).values({
        familyId: 1,
        category: testBudget.category,
        value: testBudget.value,
        date: new Date(testBudget.date)
      }).returning();

      const budgetId = insertResult[0].id;

      const res = await request(app).delete(`/api/budgets/${budgetId}`);
      
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Orçamento excluído com sucesso');

      // Verificar se o orçamento foi realmente excluído
      const getRes = await request(app).get(`/api/budgets/${budgetId}`);
      expect(getRes.status).toBe(404);
    });

    it('deve retornar erro 404 quando o orçamento não existe', async () => {
      const res = await request(app).delete('/api/budgets/9999');
      
      expect(res.status).toBe(404);
    });
  });
});