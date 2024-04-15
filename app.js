//fichier qui contiens notre application express qui recupère les requêtes de server.js et y répond

const express = require('express');

//création de l'application express
const app = express();

//middleware = fonction express qui reçoit la requête req et la réponse res, qui les geres, et qui eventuellement passe la main au middleware suivant next, pour continuer l'execution du serveur en utilisant la méthode next() en fin de fonction  

app.use((req, res, next) => {
    console.log('Requête reçue !');
    next();
  });
  
  app.use((req, res, next) => {
    res.status(201);
    console.log('statut 201 envoyé !');
    next();
  });

app.use((req, res, next) => 
{
    //retourne une reponse avec un message au format json
    res.json({ message: 'Votre requête a bien été reçue !' });
    next();
});


app.use((req, res, next) => {
    console.log('Réponse envoyée avec succès !');
  });
  
//exporter l'application express pour y accéder depuis les autres fichiers (ex notre serveur node)
module.exports = app;
