// objet http qui permet de créer un serveur
const http = require('http');

//importer l'application express
const app = require('./app');

//dire a la fonction express sur quel port elle doit tourner
app.set('port', process.env.PORT || 3000);

//notre server node sert notre application express (app)
//l'application express est notre serveur http qui écoute les requêtes et y répond
const server = http.createServer(app);

// le serveur écoute sur le port 3000 si il n'y a pas de port défini dans les variables d'environnement
server.listen(process.env.PORT || 3000);