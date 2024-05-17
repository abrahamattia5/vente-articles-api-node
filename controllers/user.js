//ce fichier contient la logique métier pour les utilisateurs, cette importer et appeler dans le routeur user.js qui lui meme est appelé dans app.js

//npm install --save bcrypt  -> telechargement et import de bcrypt pour hasher les mots de passe
const bcrypt = require('bcrypt');
//model User pour manipuler les utilisateurs dans la BDD
const User = require('../models/User');

exports.signup = (req, res, next) => 
{
    //on commence par hasher le mot de passe pour le sécuriser : on le recupère dans le corps de la requête et on utilise la méthode hash de bcrypt pour le hasher
    //on lui passe le mot de passe en clair et un nombre de tours de l'algorithme de hashage, ici 10. plus le nombre de tours est élevé, plus l'opération est sécurisée mais plus elle est longue.
    //le nombre de tours est un compromis entre sécurité et performance. le nombre de tour correspond au nombre de fois que l'algorithme de hashage est appliqué sur le mot de passe avant d'être enregistré dans la BDD.
    bcrypt.hash(req.body.password, 10)
        //hash => signifie que hash est le mot de passe hashé et => signifie que la fonction fléchée suivante sera exécutée une fois le hash créé
        .then(hash => 
        {
            //on crée un nouvel utilisateur avec le mot de passe hashé
            const user = new User(
            {
                email: req.body.email,
                password: hash
            });
            //on enregistre l'utilisateur dans la BDD
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => 
{
    //
};