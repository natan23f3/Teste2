import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import { users, families, budgets, expenses } from '../drizzle/schema';
import { info, error } from '../server/utils/logger';
import bcrypt from 'bcrypt';

// Carrega as variáveis de ambiente
dotenv.config();

/**
 * Script para popular o banco de dados com dados iniciais
 * 
 * Este script cria dados de exemplo no banco de dados, incluindo:
 * - Usuários
 * - Famílias
 * - Orçamentos
 * - Despesas
 */
async function main() {
  info('🌱 Iniciando seed do banco de dados...');

  // Verifica se a variável de ambiente DATABASE_URL está definida
  if (!process.env.DATABASE_URL) {
    error('❌ Erro: DATABASE_URL não definida no arquivo .env');
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

    // Cria usuários de exemplo
    info('👤 Criando usuários de exemplo...');
    
    // Hash das senhas
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    const userPasswordHash = await bcrypt.hash('user123', 10);
    
    // Insere usuários
    const [admin, user1, user2] = await db.insert(users).values([
      {
        name: 'Administrador',
        email: 'admin@finfam.com',
        password: adminPasswordHash,
        role: 'admin',
      },
      {
        name: 'João Silva',
        email: 'joao@exemplo.com',
        password: userPasswordHash,
        role: 'user',
      },
      {
        name: 'Maria Souza',
        email: 'maria@exemplo.com',
        password: userPasswordHash,
        role: 'user',
      }
    ]).returning();
    
    info(`✅ Usuários criados: ${admin.id}, ${user1.id}, ${user2.id}`);
    
    // Cria famílias de exemplo
    info('👪 Criando famílias de exemplo...');
    
    const [family1, family2] = await db.insert(families).values([
      {
        name: 'Família Silva',
        adminId: user1.id,
      },
      {
        name: 'Família Souza',
        adminId: user2.id,
      }
    ]).returning();
    
    info(`✅ Famílias criadas: ${family1.id}, ${family2.id}`);
    
    // Cria orçamentos de exemplo
    info('💰 Criando orçamentos de exemplo...');
    
    const currentDate = new Date();
    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(currentDate.getMonth() + 1);
    
    const [budget1, budget2, budget3, budget4] = await db.insert(budgets).values([
      {
        familyId: family1.id,
        category: 'Alimentação',
        value: 1000,
        date: currentDate,
      },
      {
        familyId: family1.id,
        category: 'Moradia',
        value: 2000,
        date: currentDate,
      },
      {
        familyId: family2.id,
        category: 'Alimentação',
        value: 1200,
        date: currentDate,
      },
      {
        familyId: family2.id,
        category: 'Transporte',
        value: 500,
        date: currentDate,
      }
    ]).returning();
    
    info(`✅ Orçamentos criados: ${budget1.id}, ${budget2.id}, ${budget3.id}, ${budget4.id}`);
    
    // Cria despesas de exemplo
    info('💸 Criando despesas de exemplo...');
    
    const [expense1, expense2, expense3, expense4] = await db.insert(expenses).values([
      {
        familyId: family1.id,
        category: 'Alimentação',
        value: 800,
        date: currentDate,
      },
      {
        familyId: family1.id,
        category: 'Moradia',
        value: 1800,
        date: currentDate,
      },
      {
        familyId: family2.id,
        category: 'Alimentação',
        value: 950,
        date: currentDate,
      },
      {
        familyId: family2.id,
        category: 'Transporte',
        value: 450,
        date: currentDate,
      }
    ]).returning();
    
    info(`✅ Despesas criadas: ${expense1.id}, ${expense2.id}, ${expense3.id}, ${expense4.id}`);
    
    info('✅ Seed concluído com sucesso!');
    info('🔑 Credenciais de exemplo:');
    info('    - Admin: admin@finfam.com / admin123');
    info('    - Usuário 1: joao@exemplo.com / user123');
    info('    - Usuário 2: maria@exemplo.com / user123');
    
    await pool.end();
  } catch (err) {
    error('❌ Erro ao executar seed:', err);
    process.exit(1);
  }
}

// Executa a função principal
main();