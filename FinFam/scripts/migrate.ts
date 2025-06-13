import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Carrega as variáveis de ambiente
dotenv.config();

/**
 * Script para executar migrações do Drizzle ORM
 * 
 * Este script executa as migrações do banco de dados usando o Drizzle ORM.
 * Ele verifica se a variável de ambiente DATABASE_URL está definida e
 * executa as migrações a partir do diretório drizzle/migrations.
 */
async function main() {
  console.log('🚀 Iniciando migrações do banco de dados...');

  // Verifica se a variável de ambiente DATABASE_URL está definida
  if (!process.env.DATABASE_URL) {
    console.error('❌ Erro: DATABASE_URL não definida no arquivo .env');
    process.exit(1);
  }

  // Verifica se o diretório de migrações existe
  const migrationsDir = path.join(__dirname, '../drizzle/migrations');
  if (!fs.existsSync(migrationsDir)) {
    console.error(`❌ Erro: Diretório de migrações não encontrado: ${migrationsDir}`);
    console.log('📝 Execute "npm run migrate:generate" para gerar as migrações primeiro.');
    process.exit(1);
  }

  try {
    // Configura a conexão com o banco de dados
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });

    // Inicializa o Drizzle ORM
    const db = drizzle(pool);

    // Executa as migrações
    console.log('🔄 Executando migrações...');
    await migrate(db, { migrationsFolder: migrationsDir });

    console.log('✅ Migrações concluídas com sucesso!');
    await pool.end();
  } catch (error) {
    console.error('❌ Erro ao executar migrações:', error);
    process.exit(1);
  }
}

// Executa a função principal
main();