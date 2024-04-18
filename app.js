//fichier qui contiens notre application express qui recupère les requêtes de server.js et y répond

const express = require('express');

//création de l'application express
const app = express();

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
    //autoriser l'accès à notre API depuis n'importe quelle origine ( '*' )
    res.setHeader('Access-Control-Allow-Origin', '*');
    //autoriser l'utilisation de certains en tete (Origin , X-Requested-With , etc.)
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    //autoriser l'utilisation de certaines méthodes (GET, POST, PUT, DELETE, PATCH, OPTIONS)
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });


  app.post('/api/stuff', (req, res, next) =>
{
    //grace a app.use(express.json()); => req.body contient l'objet JSON envoyé par le client
    console.log(req.body);
    //retourner une réponse au client pour éviter que la requête ne reste en attente et finisse par expirer, ce qui pourrait entraîner une erreur côté client
    //201 = création d'une ressource en BDD
    res.status(201).json({ message: 'Objet créé !'});
});

//app.use attribut un middleware à une route spécifique
//app.get permet de répondre uniquement aux requêtes GET
app.get('/api/stuff', (req, res, next) => 
{
    const stuff = [
      {
        _id: 'oeihfzeoi',
        title: 'Mon premier objet',
        description: 'Les infos de mon premier objet',
        imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
        price: 4900,
        userId: 'qsomihvqios',
      },
      {
        _id: 'oeihfzeomoihi',
        title: 'Mon deuxième objet',
        description: 'Les infos de mon deuxième objet',
        imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
        price: 2900,
        userId: 'qsomihvqios',
      },
    ];
    //attribuer un statut de réponse 200 (succès) à la réponse et envoyer le tableau contenant les objets au format JSON en tant que réponse
    res.status(200).json(stuff);
  });
  
  
//exporter l'application express pour y accéder depuis les autres fichiers (ex notre serveur node)
module.exports = app;
