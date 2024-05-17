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

