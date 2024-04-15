// objet http qui permet de créer un serveur
const http = require('http');

//importer l'application express
const app = require('./app');

//normalizePort renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

//dire a la fonction express sur quel port elle doit tourner
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

//errorHandler recherche les différentes erreurs et les gère de manière appropriée. l'erreure est ensuite enregistrée dans le serveur
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

//notre server node sert notre application express (app)
//l'application express est notre serveur http qui écoute les requêtes et y répond
const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

//le serveur écoute sur le port 3000 si il n'y a pas de port défini dans les variables d'environnement
server.listen(port);
