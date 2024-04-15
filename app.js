//fichier qui contiens notre application express

const express = require('express');

//création de l'application express
const app = express();

//
app.use((req, res) => 
{
    //
    res.json({ message: 'Votre requête a bien été reçue !' });
});
//exporter l'application express pour y accéder depuis les autres fichiers (ex notre serveur node)
module.exports = app;
