// ce fichier contiens les routes des articles. la logique metier de ces routes ce trouvent dans le controller controllers/stuff.js

const express = require('express');

//import du middleware pour sécuriser les routes et vérifier l'authentification
const auth = require('../middleware/auth');

//creation d'un routeur express : ce routeur sera exporté et ajouté à notre application express dans app.js
const router = express.Router();

//import du controller pour les routes de l'application
const stuffCtrl = require('../controllers/stuff');

//le debut des routes api/stuff qui sera ajouté avant toutes les routes dans app.js

router.get('/',  auth ,stuffCtrl.getAllThings );
router.get('/:id', auth , stuffCtrl.getOneThing );
router.post('/', auth , stuffCtrl.createThing );
router.put('/:id', auth , stuffCtrl.modifyThing );
router.delete('/:id', auth , stuffCtrl.deleteThing );

module.exports = router;