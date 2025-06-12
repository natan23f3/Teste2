const { app } = require('./server/server');
let server;

module.exports = async () => {
  console.log('Configuração global do Jest');
  await new Promise(resolve => {
    server = app.listen(3000, () => {
      console.log('Servidor de teste rodando em http://localhost:3000');
      resolve();
    });
  });
  
  // Exportar o servidor para que possa ser fechado no teardown
  global.__SERVER__ = server;
};