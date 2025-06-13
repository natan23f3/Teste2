import { Express } from 'express-serve-static-core';

declare global {
  namespace Express {
    interface User {
      id: number;
      name: string;
      email: string;
      role: string;
    }
  }
}