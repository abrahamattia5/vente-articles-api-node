//ce fichier contient la logique métier pour les utilisateurs, cette importer et appeler dans le routeur user.js qui lui meme est appelé dans app.js

//npm install --save bcrypt  -> telechargement et import de bcrypt pour hasher les mots de passe
const bcrypt = require('bcrypt');
//model User pour manipuler les utilisateurs dans la BDD
const User = require('../models/User');

//npm install --save jsonwebtoken -> import de jsonwebtoken pour attribuer un token à un utilisateur lors de sa connexion
const jwt = require('jsonwebtoken');

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
    //on cherche dans la BDD si le champ email d'un utilisateur correspond au email envoyé dans la requête
    User.findOne({ email: req.body.email })
        //si la fonction findOne n'echoue pas, on recupere la valeur retournée par notre requête dans une promesse (user)
        .then(user => 
        {
            //si aucun utilisateur n'est trouvé avec cet email
            if (!user) 
            {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
            }
            //si non (un utilisateur est trouvé avec cet email), on compare le mot de passe envoyé dans la requête avec le hash enregistré dans la BDD pour cet utilisateur (fonction compare de bcrypt
            bcrypt.compare(req.body.password, user.password)
                //si la fonction compare ne renvoie pas d'erreur, elle renvoie un booléen qui indique si le mot de passe est le bon ou non
                .then(valid => 
                {
                    if (!valid)
                    {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    res.status(200).json(
                    {
                        userId: user._id,
                        token: jwt.sign
                        (
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                //si la fonction compare renvoie une erreur
                .catch(error => res.status(500).json({ error }));
        })
        //si la fonction findOne ne reussi pas (erreur d'execution dans la BDD)
        .catch(error => res.status(500).json({ error }));
};