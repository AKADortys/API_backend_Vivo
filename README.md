# API Backend Documentation

## Description
Ce projet est une API backend développée avec le framework Express. L’API interagit avec une base de données MySQL et utilise des variables d’environnement pour la configuration. Elle permet de gérer des utilisateurs, des articles, et des processus d’authentification.

## Prérequis

- **Node.js** (version 14 ou ultérieure)
- **Serveur MySQL** fonctionnel
- **Fichier `.env`** configuré avec les informations suivantes :
  - `DB_HOST` : Adresse du serveur MySQL
  - `DB_USER` : Nom d'utilisateur de la base de données
  - `DB_PASSWORD` : Mot de passe de la base de données
  - `DB_NAME` : Nom de la base de données
  - `PORT` : Port d'exécution de l'application (par défaut : 3000)

## Installation

1. **Cloner le dépôt :**
   ```bash
   git clone <URL_du_dépôt>
   cd <nom_du_répertoire>
   ```

2. **Installer les dépendances :**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement :**
   - Créez un fichier `.env` à la racine du projet.
   - Ajoutez les configurations requises mentionnées ci-dessus.

4. **Configurer la base de données :**
   - Créez une base de données nommée comme configurée dans votre fichier `.env`.
   - Assurez-vous que le serveur MySQL est en cours d'exécution.

5. **Lancer l'application :**
   ```bash
   npm start
   ```

## Endpoints

### Gestion des utilisateurs
- **GET** `/user/getUser/:id?` : Récupérer un utilisateur par son ID
- **GET** `/user/getAll` : Récupérer tous les utilisateurs
- **PUT** `/user/updateUser/:id?` : Mettre à jour un utilisateur
- **DELETE** `/user/deleteUser/:id?` : Supprimer un utilisateur

### Authentification
- **POST** `/auth/register` : Créer un compte utilisateur
- **POST** `/auth/login` : Connexion d'un utilisateur
- **POST** `/auth/refresh` : Rafraîchir le token d'accès
- **POST** `/auth/logout` : Déconnexion d'un utilisateur

### Gestion des articles
- **GET** `/article/getArticle/:id?` : Récupérer un article par son ID
- **GET** `/article/getAll` : Récupérer tous les articles
- **POST** `/article/createArticle` : Créer un nouvel article
- **PUT** `/article/updateArticle/:id?` : Mettre à jour un article
- **DELETE** `/article/delete/:id?` : Supprimer un article

### Gestion des commandes
- **GET** `/order/1/articlesDel` : Supprimer un ou plusieurs articles d’une commande
- **GET** `/order/getUserOrders/:id` : Récupérer toutes les commandes d'un utilisateur
- **POST** `/order/2/articlesAdd` : Ajouter un ou plusieurs articles à une commande
- **PUT** `/order/1/confirm` : Confirmer une commande
- **GET** `/order/1/available` : Vérifier la disponibilité des articles d'une commande
- **DELETE** `/order/delete/:id` : Supprimer une commande
- **GET** `/order/getOrder/:id` : Récupérer une commande par son ID
- **GET** `/order/getAll` : Récupérer toutes les commandes
- **GET** `/order/current/:id` : Récupérer la commande en cours pour un utilisateur

## Dépendances
- [bcrypt](https://www.npmjs.com/package/bcrypt) : ^5.1.1
- [body-parser](https://www.npmjs.com/package/body-parser) : ^1.20.3
- [cors](https://www.npmjs.com/package/cors) : ^2.8.5
- [crypto](https://www.npmjs.com/package/crypto) : ^1.0.1
- [dotenv](https://www.npmjs.com/package/dotenv) : ^16.4.5
- [express](https://www.npmjs.com/package/express) : ^4.21.1
- [express-session](https://www.npmjs.com/package/express-session) : ^1.18.1
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) : ^9.0.2
- [mysql2](https://www.npmjs.com/package/mysql2) : ^3.11.3
- [sequelize](https://www.npmjs.com/package/sequelize) : ^6.37.5
- [validator](https://www.npmjs.com/package/validator) : ^13.12.0


