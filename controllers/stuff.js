//ce fichier contient la logique metier des routes des articles contenues dns routes/stuff.js

//importer thing pour manipuler des articles
const Thing = require('../models/Thing');
//FileSystem pour accéder au système de fichier et supprimer des fichiers
const fs = require('fs');

exports.getAllThings = (req, res, next) => 
{
    //récupérer tous les objets de la base de données
    Thing.find()
        .then(things => res.status(200).json(things))
        .catch(error => res.status(400).json({ error }));
        
};

exports.getOneThing = (req, res, next) => 
{
    //_id: req.params.id -> l'_id de de l'element a chercher en BDD et egale à l'id passé en paramètre dans l'url : req.params.id
    Thing.findOne({ _id: req.params.id })
    .then(thing => res.status(200).json(thing))
    .catch(error => res.status(404).json({ error }));
};

exports.createThing = (req, res, next) =>
{
    //l'objet recu est du json mais sous format string : il faut le parser en JSON
    const thingObject = JSON.parse(req.body.thing);
    //on ne fait pas confiance a l'utilisateur : on supprime l'id de l'objet qui sera generer par la BDD et le userId de l'objet recu de sa part.
    delete thingObject._id;
    delete thingObject._userId;
    const thing = new Thing(
    {
        ...thingObject,
        //on recupere l'userId du token pour l'associer a l'objet (pour eviter uune faille de securitée qui permettrait d'accéder a des données d'autres utilisateurs en modifiant l'userId)
        userId: req.auth.userId,
        //multer nous fournit seulement le nom de fichier : on construit l'url (la route) complete de l'image en utilisant le protocol (http ou https) et le nom de l'hote (localhost:3000) , le dossier images qui contient les images et le nom du fichier donné par multer : req.file.filename
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
  
    thing.save()
        .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
        .catch(error => { res.status(400).json( { error })})
};


exports.modifyThing = (req, res, next) => 
{
    //on verifie avec un ternaire si il y a un champ file et donc un fichier dans la requete : si oui on parse en JSON et on construit l'objet avec l'url de l'image, si non on construit l'objet avec les données recu qui sont deja en JSON
    const thingObject = req.file ? 
    {
        //on parse l'objet thing qui est en string en objet JSON
        ...JSON.parse(req.body.thing),
        //on construit l'url (la route) complete de l'image en utilisant le protocol (http ou https) et le nom de l'hote (localhost:3000) , le dossier images qui contient les images et le nom du fichier donné par multer : req.file.filename
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } 
    : 
    //si il n'y a pas de fichier dans la requete on construit l'objet avec les données recu qui sont deja en JSON
    { ...req.body };
  
    //Pour éviter que quelqu'un crée un objet avec son userId puis le modifie pour le passer à un autre utilisateur, on vérifie que l'objet a bien été créé par l'utilisateur qui le modifie
    delete thingObject._userId;
    //on cherche l'objet dans la BDD (grace a son id) pour verifier si c'est l'utilisateur qui l'a créé qui le modifie
    Thing.findOne({_id: req.params.id})
        .then((thing) => 
        {
            //on verifie si l'userId de l'objet en BDD est le meme que celui de l'utilisateur qui cherche a le modifier. on prend l'userId du token de cette requette (req.auth.userId) et on le compare a l'userId de l'objet en BDD
            if (thing.userId != req.auth.userId) 
            {
                res.status(401).json({ message : 'Not authorized'});
            } 
            else 
            {
                //chercher si il y a une nouvelle image dans la requete pour supprimer l'ancienne image et eviter de saturer le serveur
                if (req.file) 
                {
                    //recuperer le nom de l'image dans l'url de l'image ( [0]=/images/ [1]=nom du fichier )
                    const filename = thing.imageUrl.split('/images/')[1];
                    //supprimer l'ancienne image
                    fs.unlink(`images/${filename}`, () => {});
                    
                }
                //mettre a jour l'objet dans la BDD avec l'objet modifié {quel objet on modifie} {avec quoi on le modifie,}
                Thing.updateOne({ _id: req.params.id}, { ...thingObject, _id: req.params.id})
                    .then(() => res.status(200).json({message : 'Objet modifié!'}))
                    .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => { res.status(400).json({ error }); });
};


exports.deleteThing = (req, res, next) => 
{
    //par securité on recupere l'objet dasn la BDD pour verifier les droits de l'utilisateur qui cherche a le supprimer grace a l'user ID du token et du possesseur de l'objet en base 
    Thing.findOne({ _id: req.params.id})
    .then(thing => {
        if (thing.userId != req.auth.userId) 
        {
            res.status(401).json({message: 'Not authorized'});
        }
        else 
        {
            //si c'est le bon utilisateur , avant de supprimer l'objet on recupere le nom de l'image dans l'url de l'image ( [0]=/images/ [1]=nom du fichier )
            const filename = thing.imageUrl.split('/images/')[1];
            //fs.unlink() permet de supprimer un fichier grace a son chemin. une fonction de callback s'execute apres la suppression du fichier et supprime l'objet dans la BDD
            fs.unlink(`images/${filename}`, () => 
            {
                Thing.deleteOne({_id: req.params.id})
                    .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                    .catch(error => res.status(401).json({ error }));
            });
        }
    })
    .catch( error => {
        res.status(500).json({ error });
    });
};

