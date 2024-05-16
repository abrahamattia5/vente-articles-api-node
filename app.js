//fichier qui contiens notre application express qui recupère les requêtes de server.js et y répond

const express = require('express');

//création de l'application express
const app = express();

//import du routeur des stuff contenue dans le dossier routes pour router l'application express
const stuffRoutes = require('./routes/stuff');

//middleware qui permet de parser les requêtes envoyées par le client, et d'extraire l'objet JSON du body de la requête
app.use(express.json());

//import de mongoose pour se connecter à la base de données
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://user:user@cluster0.dz32xny.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


//app.use() = intercepte TOUTES les requettes envoyées à notre serveur
//middleware = fonction express qui reçoit la requête req et la réponse res, qui les geres, et qui eventuellement passe la main au middleware suivant next, pour continuer l'execution du serveur en utilisant la méthode next() en fin de fonction  

//middleware general qui ne concerne pas de route spécifique
//middleware pour eviter les erreurs CORS (Cross Origin Resource Sharing)
app.use((req, res, next) => 
{
    //autoriser l'accès à notre API depuis n'importe quelle origine ( '*' ) -> pour eviter les erreurs CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    //autoriser l'utilisation de certains en tete (Origin , X-Requested-With , etc.)
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    //autoriser l'utilisation de certaines méthodes (GET, POST, PUT, DELETE, PATCH, OPTIONS)
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

//pour la route /api/stuff, on utilise le routeur exposé par stuffRoutes qui contient toutes la logique des routes pour les articles et ne polue pas notre fichier app.js
app.use('/api/stuff', stuffRoutes);
  
// image d'exemple : https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg
//exporter l'application express pour y accéder depuis les autres fichiers (ex notre serveur node)
module.exports = app;
