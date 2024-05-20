const multer = require('multer');

//dictionnaire des types MIME pour définir le format de l'image téléchargée par la suite
const MIME_TYPES = 
{
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

//diskStorage est une méthode de multer qui indique qu'on enregistre sur le disque
const storage = multer.diskStorage(
{
    //multer a besoin de deux éléments,
    //1-destination ici 'images' en 2e argument du callback
    destination: (req, file, callback) => 
        {
            callback(null, 'images');
        },
    //2-nom du fichier a enregistrer afin d'éviter les doublons
    filename: (req, file, callback) => 
        {
            //nom du fichier original, on le split pour enlever les espaces et on le remplace par des underscores
            const name = file.originalname.split(' ').join('_');
            //on crée l'extension du fichier grace au dictionnaire MIME_TYPES qui est un objet qui retourne les extensions (jpg, jpeg, png) correspondant aux types MIME demandé 
            const extension = MIME_TYPES[file.mimetype]; //donc l'extention retournée par MIME_TYPES est jpg ou png en fonction du type MIME
            //on appelle le callback pour créer le nom du fichier, null pour dire qu'il n'y a pas d'erreurs, on prend le nom du fichier, on ajoute un timestamp pour éviter les doublons et ensuite .extension
            callback(null, name + Date.now() + '.' + extension);
        }
});

//on exporte la methode multer en lui passant l'objet storage qui contient les informations sur l'enregistrement des fichiers (ici dans le disque) 
//.single('image') signifie qu'il s'agit d'un fichier unique que l'on recois, et que c'est un fichier image uniquement
module.exports = multer({storage: storage}).single('image');