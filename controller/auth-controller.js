const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwtConfig");
const bcrypt = require("bcrypt");
const validator = require('validator');
const { Utilisateur } = require("../config/dbconfig");

const AuthController = {
  // Méthode de vérification des données utilisateur
  CheckData(data) {
    const { mail, pwd, phone, nom, prenom } = data;

    if (!validator.isEmail(mail)) {
      console.log("Validation échouée : email non valide");
      return { valid: false, message: "L'email n'est pas valide !" };
    }

    if (!validator.isLength(pwd, { min: 6, max: 100 })) {
      console.log("Validation échouée : mot de passe invalide");
      return {
        valid: false,
        message: "Le mot de passe doit contenir entre 6 et 100 caractères.",
      };
    }

    if (!validator.isMobilePhone(phone, "fr-BE")) {
      console.log("Validation échouée : numéro de téléphone invalide", phone);
      return {
        valid: false,
        message: "Le numéro de téléphone n'est pas valide.",
      };
    }

    if (!validator.isLength(nom, { min: 2, max: 50 })) {
      console.log("Validation échouée : nom invalide");
      return {
        valid: false,
        message: "Le nom doit contenir entre 2 et 50 caractères.",
      };
    }

    if (!validator.isLength(prenom, { min: 2, max: 50 })) {
      console.log("Validation échouée : prénom invalide");
      return {
        valid: false,
        message: "Le prénom doit contenir entre 2 et 50 caractères.",
      };
    }

    return { valid: true };
  },
  // Méthode pour la connexion
  async login(req, res) {
    try {
      // Recherche de l'utilisateur par email
      const utilisateur = await Utilisateur.findOne({
        where: { mail: req.body.mail },
      });

      // Vérification de l'existence de l'utilisateur
      if (!utilisateur) {
        return res.status(404).json({ message: "Utilisateur introuvable" });
      }

      // Vérification du mot de passe
      const isPasswordValid = await bcrypt.compare(
        req.body.pwd,
        utilisateur.pwd
      );
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Mot de passe incorrect" });
      }

      // Suppression du mot de passe avant de retourner la réponse
      const utilisateurData = { ...utilisateur.toJSON() };
      delete utilisateurData.pwd;
      const token = jwt.sign({ id: utilisateur.id }, jwtConfig.secret, {
        expiresIn: jwtConfig.expiresIn,
      });

      res.json({ success: true, utilisateur: utilisateurData, token: token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur interne lors de la connexion" });
    }
  },
  async register(req, res) {
    try {
      const validation = AuthController.CheckData(req.body);
      if (!validation.valid)
        return res.status(400).json({ message: validation.message });
      const utilisateur = await Utilisateur.create(req.body);
      res.status(201).json(utilisateur);
    } catch (error) {
      console.error(error);
      res
        .status(400)
        .json({ message: "Erreur lors de l'ajout de l'utilisateur" });
    }
  },
};

module.exports = AuthController;
