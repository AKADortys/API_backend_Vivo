const { Sequelize, DataTypes } = require('sequelize');
const utilisateurModel = require('../model/utilisateur');
const articleModel = require('../model/article');
const orderModel = require('../model/order');
const articleOrderModel = require('../model/articleOrder');
const newsletterModel = require('../model/newsletter');

const sequelize = new Sequelize(
    'Vivo',
    'admin',
    'password_admin',    
    {
       host: 'localhost',
       dialect: 'mysql',
       dialectOptions: {
          timezone: 'Etc/GMT-2'     
       },
       logging: false
    }
);

sequelize.authenticate()
   .then(() => {
      console.log('Connecté à la base de données MySQL avec Sequelize');
   })
   .catch((err) => {
      console.error('Erreur de connexion à la base de données :', err);
   });

// Définition du modèle Utilisateur
const Utilisateur = utilisateurModel(sequelize, DataTypes);
const Article = articleModel(sequelize, DataTypes);
const Order = orderModel(sequelize, DataTypes);
const ArticleOrder = articleOrderModel(sequelize, DataTypes);
const Newsletter = newsletterModel(sequelize, DataTypes);

// Synchronisation des modèles
sequelize.sync({ force: true })
   .then(() => {
      console.log('Modèles synchronisés avec la base de données');
   })
   .catch((err) => {
      console.error('Erreur lors de la synchronisation des modèles :', err);
   });

module.exports = { sequelize, Utilisateur, Article, Order, ArticleOrder, Newsletter };
