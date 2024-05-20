const jwt = require('jsonwebtoken');
 
module.exports = (req, res, next) => 
{
    try
    {
        //recuperer le token dans le header Authorization de la requête. le token est après le mot clé Bearer et un espace donc en position 1 dans le tableau retourné par split(' ') (separe par un espace)
        const token = req.headers.authorization.split(' ')[1];
        //vérifier le token avec la méthode verify de jwt qui prend le token recupéré et la clé secrète pour vérifier le token
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        //extraire l'ID utilisateur du token
        const userId = decodedToken.userId;
        //on ajoute l'ID utilisateur a l'objet req (request) qui est transmis a la prochaine fonction,(routes/stuff.js) pour qu'elle puisse l'utiliser (pour savoir si l'utilisateur est bien celui qui a créé l'objet par exemple
        req.auth = 
        {
            userId: userId
        };

        next();
    }
    catch(error)
    {
        res.status(401).json({ error });
    }
};