//ce fichier correspond a une chose (thing) c'est a dire un article. il sert a determiner un article dans le cadre de notre application web
//il contient un schema qui est un objet de configuration de mongoose qui permet de définir la structure des données que l'on souhaite enregistrer dans la base de données

//import de mongoose
const mongoose = require('mongoose');

//création d'un schema de données mongoose (avec .Schema() ) qui contient un objet avec les champs souhaités pour chaque objet de la base de données
//La méthode  Schema  de Mongoose vous permet de créer un schéma de données pour votre base de données MongoDB.
//l'id est automatiquement creer par mongoose 
const thingSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  userId: { type: String, required: true },
  price: { type: Number, required: true }
});

//on exporte le schéma pour le rendre disponible pour express
//le shema est ensuite transformé en modèle utilisable avec mongoose.model() qui prend 2 arguments : le nom du modèle et le schema à utiliser pour en faire un modèle
module.exports = mongoose.model('Thing', thingSchema);