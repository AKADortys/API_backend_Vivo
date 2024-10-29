const bcrypt = require('bcrypt');
module.exports = (sequelize, DataTypes) => {
    const Utilisateur = sequelize.define('Utilisateur', {
      id_user: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      pwd: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'Un mot de passe est requis !' },
          len: { args: [6, 100], msg: 'Le mot de passe doit faire entre 6 et 100 caractères.' }
        }
      },
      mail: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: { args: true, msg: 'L\'email fourni n\'est pas valide !' }
        }
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: { args: /^[0-9+]*$/, msg: 'Le numéro de téléphone doit être valide.' }
        }
      },
      nom: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: { args: /^[a-zA-Zàâçéèêëîïôûùüÿñæœ\s-]+$/, msg: 'Le nom ne peut contenir que des lettres alphabétiques.' }
        }
      },
      prenom: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: { args: /^[a-zA-Zàâçéèêëîïôûùüÿñæœ\s-]+$/, msg: 'Le prénom ne peut contenir que des lettres alphabétiques.' }
        }
      },
    }, {
      tableName: 'Utilisateur',
      timestamps: true
    });
  
    // Fonction pour hacher le mot de passe avant l'insertion
    Utilisateur.beforeCreate(async (utilisateur, options) => {
      const hashedPassword = await bcrypt.hash(utilisateur.pwd, 10);
      utilisateur.pwd = hashedPassword;
    });

    return Utilisateur;
};