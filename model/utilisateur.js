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
        allowNull: true,
        unique: true,
        validate: {
          isEmail: { args: true, msg: 'L\'email fourni n\'est pas valide !' }
        }
      },
      admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      nom: {
        type: DataTypes.STRING,
        allowNull: true, // Autorise la valeur null
        validate: {
          is: { args: /^[a-zA-Z]+$/, msg: 'Le nom ne peut contenir que des lettres alphabétiques.' }
        }
      },
      prenom: {
        type: DataTypes.STRING,
        allowNull: true, // Autorise la valeur null
        validate: {
          is: { args: /^[a-zA-Z]+$/, msg: 'Le prénom ne peut contenir que des lettres alphabétiques.' }
        }
      },
      date_inscri: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.fn('NOW')
      }
    }, {
      tableName: 'Utilisateur',
      timestamps: false
    });
  
    // Fonction pour hacher le mot de passe avant l'insertion
    Utilisateur.beforeCreate(async (utilisateur, options) => {
      const hashedPassword = await bcrypt.hash(utilisateur.pwd, 10);
      utilisateur.pwd = hashedPassword;
    });

    return Utilisateur;
};