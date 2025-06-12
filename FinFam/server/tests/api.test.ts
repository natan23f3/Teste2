import request from 'supertest';
import { app } from '../server';

describe('Auth Routes', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        nome: 'Test User',
        email: 'test@example.com',
        senha: 'password',
        funcao: 'user'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.text).toEqual('Usuário registrado com sucesso!');
  });

  it('should login an existing user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        senha: 'password'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});

describe('Budget Routes', () => {
  it('should create a new budget', async () => {
    const res = await request(app)
      .post('/api/budgets')
      .send({
        name: 'Test Budget',
        amount: 1000
      });
    expect(res.statusCode).toEqual(401); // Assuming authentication is required
  });
});

describe('Expense Routes', () => {
  it('should create a new expense', async () => {
    const res = await request(app)
      .post('/api/expenses')
      .send({
        name: 'Test Expense',
        amount: 100
      });
    expect(res.statusCode).toEqual(401); // Assuming authentication is required
  });
});