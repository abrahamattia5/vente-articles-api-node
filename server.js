// objet http qui permet de créer un serveur
const http = require('http');

const server = http.createServer((req, res) => 
{
    //res.end permet de renvoyer une réponse "string" au client
    res.end('Voici la réponse du serveur !');
});
// le serveur écoute sur le port 3000 si il n'y a pas de port défini dans les variables d'environnement
server.listen(process.env.PORT || 3000);