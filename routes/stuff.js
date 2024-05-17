// ce fichier contiens les routes des articles. la logique metier de ces routes ce trouvent dans le controller controllers/stuff.js
//creation d'un routeur express : ce routeur sera exporté et ajouté à notre application express dans app.js
const express = require('express');
const router = express.Router();

//import du controller pour les routes de l'application
const stuffCtrl = require('../controllers/stuff');

//le debut des routes api/stuff qui sera ajouté avant toutes les routes dans app.js

router.get('/', stuffCtrl.getAllThings );
router.get('/:id', stuffCtrl.getOneThing );
router.post('/', stuffCtrl.createThing );
router.put('/:id', stuffCtrl.modifyThing );
router.delete('/:id', stuffCtrl.deleteThing );

module.exports = router;