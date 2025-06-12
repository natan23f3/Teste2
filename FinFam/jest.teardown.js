module.exports = async () => {
  console.log('Desconfiguração global do Jest');
  
  // Obter o servidor da variável global
  const server = global.__SERVER__;
  
  if (server) {
    await new Promise(resolve => server.close(() => {
      console.log('Servidor de teste fechado');
      resolve();
    }));
  } else {
    console.log('Servidor não encontrado para fechar');
  }
};