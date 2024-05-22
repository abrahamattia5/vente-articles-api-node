//ce fichier contient la logique metier des routes des articles contenues dns routes/stuff.js

//importer thing pour manipuler des articles
const Thing = require('../models/Thing');

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
    // {_iD = id du param } , { spread operator pour recuperer les champs de l'objet req.body : qui correspond a l'id du parametre de la requete }
    Thing.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteThing = (req, res, next) => 
{
    Thing.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
        .catch(error => res.status(400).json({ error }));
};

