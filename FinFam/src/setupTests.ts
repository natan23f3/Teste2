// Importações necessárias para configurar o ambiente de teste
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// Configuração global para o React Testing Library
configure({
  testIdAttribute: 'data-testid',
});

// Mock global para o localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// Configuração do localStorage mock
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock para o matchMedia (necessário para alguns componentes)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Silenciar os warnings do console durante os testes
global.console = {
  ...console,
  // Manter o erro para debugging
  error: jest.fn(),
  // Silenciar warnings
  warn: jest.fn(),
  // Manter o log para debugging
  log: jest.fn(),
};