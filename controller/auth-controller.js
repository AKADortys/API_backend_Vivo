const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwtConfig");
const bcrypt = require("bcrypt");
const validator = require("validator");
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
  async login(req, res) {
    try {
      // Rechercher l'utilisateur et valider son mot de passe (voir ton code de connexion)
      const utilisateur = await Utilisateur.findOne({
        where: { mail: req.body.mail },
      });
      if (!utilisateur)
        return res.status(404).json({ message: "Utilisateur introuvable" });

      const isPasswordValid = await bcrypt.compare(
        req.body.pwd,
        utilisateur.pwd
      );
      if (!isPasswordValid)
        return res.status(401).json({ message: "Mot de passe incorrect" });

      // Supprimer le mot de passe avant de retourner la réponse
      const utilisateurData = {...utilisateur.toJSON() };
      delete utilisateurData.pwd;

      // Générer access token et refresh token
      const accessToken = jwt.sign({ id: utilisateur.id }, jwtConfig.secret, {
        expiresIn: "15m",
      });
      const refreshToken = jwt.sign(
        { id: utilisateur.id },
        jwtConfig.refreshSecret,
        { expiresIn: "7d" }
      );

      // Stocker le refresh token dans la session
      req.session.refreshToken = refreshToken;
      req.session.user = utilisateurData
      utilisateurData.accessToken = accessToken;

      // Envoyer l'access token et le refresh token dans la réponse (temporaire) !!!!!!!!
      res.json({success:true, user : utilisateurData});
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
      delete utilisateur.pwd;
      res.status(201).json(utilisateur);
    } catch (error) {
      console.error(error);
      res
        .status(400)
        .json({ message: "Erreur lors de l'ajout de l'utilisateur" });
    }
  },
  async logout(req, res) {
    // Supprimer le refresh token de la session
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: "Erreur lors de la déconnexion" });
        }
        res.clearCookie('connect.sid'); // Supprime le cookie de session
        res.json({ message: "Déconnexion réussie" });
    });
},
async refreshToken(req, res) {
  const refreshToken = req.session.refreshToken;

  if (!refreshToken) {
      return res.status(403).json({ message: "Token de rafraîchissement manquant" });
  }

  try {
      // Vérifier la validité du refresh token
      const decoded = jwt.verify(refreshToken, jwtConfig.refreshSecret);

      // Générer un nouveau access token
      const newAccessToken = jwt.sign({ id: decoded.id }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });

      // Retourner le nouveau access token
      res.json({ accessToken: newAccessToken });
  } catch (error) {
      console.error(error);
      res.status(403).json({ message: "Token de rafraîchissement invalide ou expiré" });
  }
}


};

module.exports = AuthController;
