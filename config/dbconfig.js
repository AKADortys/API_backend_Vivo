const { Sequelize, DataTypes } = require('sequelize');
const utilisateurModel = require('../model/Utilisateur');
const articleModel = require('../model/Article');
const orderModel = require('../model/Order');
const articleOrderModel = require('../model/ArticleOrder');
const newsletterModel = require('../model/Newsletter');

const dbName = process.env.DATABASE_NAME;
const dbHost = process.env.DATABASE_HOST;
const dbUser = process.env.DATABASE_USER;
const dbPass = process.env.DATABASE_PASS;

const sequelize = new Sequelize(
    dbName,
    dbUser,
    dbPass,    
    {
       host: dbHost,
       dialect: 'mysql',
       dialectOptions: {
          timezone: 'Etc/GMT+2'     
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
sequelize.sync({ force: false })
   .then(() => {
      console.log('Modèles synchronisés avec la base de données');
   })
   .catch((err) => {
      console.error('Erreur lors de la synchronisation des modèles :', err);
   });

module.exports = { sequelize, Utilisateur, Article, Order, ArticleOrder, Newsletter };
