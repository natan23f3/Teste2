import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { users } from '../../drizzle/schema'; // Importe a tabela 'users' do seu schema
import { randomUUID } from 'crypto';

async function createTestUsers() {
  const pool = new Pool({
    connectionString: 'postgresql://finfam_owner:npg_Mm8f1OCDNGUB@ep-late-bonus-a8w9igr4-pooler.eastus2.azure.neon.tech/finfam?sslmode=require',
  });

  const db = drizzle(pool);

  try {
    await db.insert(users).values([
      { name: 'Test User 1', email: 'test1@example.com', password: 'password1' },
      { name: 'Test User 2', email: 'test2@example.com', password: 'password2' },
    ]);

    console.log('Usuários de teste criados com sucesso!');
  } catch (error) {
    console.error('Erro ao criar usuários de teste:', error);
  } finally {
    await pool.end();
  }
}

createTestUsers();