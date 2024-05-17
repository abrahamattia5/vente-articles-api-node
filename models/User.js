const mongoose = require('mongoose');
//Pour permettre à chaque utilisateur d'avoir un validateur unique ici le mail. on utilise le package mongoose-unique-validator : npm install --save mongoose-unique-validator
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema
({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
//unique: true pour que chaque utilisateur ai un email unique. afin que ce soit bien pris en charge apr mongoose, il faut installer un package supplémentaire : npm install --save mongoose-unique-validator
//On applique ce validateur au schéma avant d'en faire un modèle. avec la méthode plugin() de mongoose qui permet de rajouter des fonctionnalités à un schéma, ici le validateur unique pour que plusieurs utilisateurs ne puissent pas partager le même email
userSchema.plugin(uniqueValidator);
//le shema est ensuite transformé en modèle utilisable avec mongoose.model() qui prend 2 arguments : le nom du modèle et le schema à utiliser pour en faire un modèle
module.exports = mongoose.model('User', userSchema); 