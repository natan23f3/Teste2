import bcrypt from 'bcrypt';

async function createTestUsers() {
  const saltRounds = 10;

  // Usuário administrador
  const adminPassword = await bcrypt.hash('admin123', saltRounds);
  const adminUser = {
    nome: 'Administrador',
    email: 'admin@finfam.com',
    senha: adminPassword,
    funcao: 'administrador',
  };
  console.log('Usuário Administrador:', JSON.stringify({ nome: adminUser.nome, email: adminUser.email, funcao: adminUser.funcao }));

  // Usuário familiar
  const familiarPassword = await bcrypt.hash('familiar123', saltRounds);
  const familiarUser = {
    nome: 'Familiar',
    email: 'familiar@finfam.com',
    senha: familiarPassword,
    funcao: 'familiar',
  };
  console.log('Usuário Familiar:', JSON.stringify({ nome: familiarUser.nome, email: familiarUser.email, funcao: familiarUser.funcao }));
}

createTestUsers();