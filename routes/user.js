//Un port de express pour pouvoir utiliser express.Router
const express = require('express');
const router = express.Router();

//import du controller user pour associer les fonctions aux différentes routes
const userCtrl = require('../controllers/user');

//création des routes pour les fonctions signup et login
//post = envoi de données, ici les données de l'utilisateur pour la création de compte OU pour son authentification
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

//export du router pour pouvoir l'utiliser dans app.js
module.exports = router;