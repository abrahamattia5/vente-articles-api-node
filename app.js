//fichier qui contiens notre application express qui recupère les requêtes de server.js et y répond

const express = require('express');

//création de l'application express
const app = express();

//import du modèle Thing pour manipuler des articles
const Thing = require('./models/Thing');

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


app.post('/api/stuff', (req, res, next) =>
{
    //les informations qui arrivent de la requête POST contiennent les info de l'objet à créer
    //on extrait l'objet JSON dans un objet Thing de la requête dans une constante thing pour le manipuler ici et pouvoir l'enregistrer en BDD
    /*
    //pour recuperer les info on peut faire de cette manière : 
    const thing = new Thing(
      {
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        price: req.body.price,
        userId: req.body.userId,
      });
    */
    //ou bien utiliser l'opérateur spread pour copier les champs de l'objet req.body dans un nouvel objet thing et automatiquement recuperer les champs de l'objet req.body dans l'objet thing
    //on supprime l'id envoyé par le client car c'est la base de données qui le génère automatiquement
    delete req.body._id;
    const thing = new Thing({ ...req.body });
    //enregistrer l'objet dans la base de données et renvoyer une réponse de réussite en cas de succès, ou une erreur en cas d'échec
    thing.save()
      //répondre avec un statut 201 en cas de succès et un message de réussite pour eviter les erreurs client si on a pas de réponse
      .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
      .catch(error => res.status(400).json({ error }));
});

//app.use attribut un middleware à une route spécifique
//app.get permet de répondre uniquement aux requêtes GET
app.get('/api/stuff', (req, res, next) => 
{
    //récupérer tous les objets de la base de données
    Thing.find()
      .then(things => res.status(200).json(things))
      .catch(error => res.status(400).json({ error }));
      
});
  
  
//exporter l'application express pour y accéder depuis les autres fichiers (ex notre serveur node)
module.exports = app;
