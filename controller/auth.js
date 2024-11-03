const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');
const bcrypt = require('bcrypt');
const {Utilisateur} =require('../config/dbconfig');

const AuthController = {
    // Méthode pour la connexion
async login(req, res) {
    try {
        // Recherche de l'utilisateur par email
        const utilisateur = await Utilisateur.findOne({ where: { mail: req.body.mail } });
        
        // Vérification de l'existence de l'utilisateur
        if (!utilisateur) {
            return res.status(404).json({ message: 'Utilisateur introuvable' });
        }
        
        // Vérification du mot de passe
        const isPasswordValid = await bcrypt.compare(req.body.pwd, utilisateur.pwd);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Mot de passe incorrect' });
        }
        
        // Suppression du mot de passe avant de retourner la réponse
        const utilisateurData = { ...utilisateur.toJSON() };
        delete utilisateurData.pwd;
        const token = jwt.sign({ id: user.id }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });

        res.json({ success: true, utilisateur: utilisateurData,token: token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur interne lors de la connexion' });
    }
},
async register(req, res) {
    try {
        console.log(req.body);
        const validation = UtilisateurController.CheckData(req.body);
        if (!validation.valid) return res.status(400).json({ message: validation.message });
        const utilisateur = await Utilisateur.create(req.body);
        res.status(201).json(utilisateur);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Erreur lors de l\'ajout de l\'utilisateur' });
    }
},
}

module.exports = AuthController;