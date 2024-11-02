const { Utilisateur } = require('../config/dbconfig');
const validator = require('validator');
const bcrypt = require('bcrypt');


let UtilisateurController = {
    // Méthode de vérification des données utilisateur
    CheckData(data) {
        const { mail, pwd, phone, nom, prenom } = data;
    
        if (!validator.isEmail(mail)) {
            console.log("Validation échouée : email non valide");
            return { valid: false, message: "L'email n'est pas valide !" };
        }
    
        if (!validator.isLength(pwd, { min: 6, max: 100 })) {
            console.log("Validation échouée : mot de passe invalide");
            return { valid: false, message: "Le mot de passe doit contenir entre 6 et 100 caractères." };
        }
    
        if (!validator.isMobilePhone(phone, 'fr-BE')) {
            console.log("Validation échouée : numéro de téléphone invalide", phone);
            return { valid: false, message: "Le numéro de téléphone n'est pas valide." };
        }
    
        if (!validator.isLength(nom, { min: 2, max: 50 })) {
            console.log("Validation échouée : nom invalide");
            return { valid: false, message: "Le nom doit contenir entre 2 et 50 caractères." };
        }
    
        if (!validator.isLength(prenom, { min: 2, max: 50 })) {
            console.log("Validation échouée : prénom invalide");
            return { valid: false, message: "Le prénom doit contenir entre 2 et 50 caractères." };
        }
    
        return { valid: true };
    },
// Méthode pour la connexion
async connect(req, res) {
    try {
        console.log(req.body)
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
        console.log(utilisateurData);
        res.json({ success: true, utilisateur: utilisateurData });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur interne lors de la connexion' });
    }
}
,
    // Retourne tous les utilisateurs
    async getAllUtilisateurs(req, res) {
        try {
            const utilisateurs = await Utilisateur.findAll();
            res.json(utilisateurs);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs' });
        }
    },

    // Recherche par ID
    async getUtilisateurById(req, res) {
        try {
            const utilisateur = await Utilisateur.findByPk(req.params.id);
            if (!utilisateur) return res.status(404).json({ message: 'Utilisateur introuvable' });
            res.json(utilisateur);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erreur lors de la récupération de l\'utilisateur' });
        }
    },
    async addUtilisateur(req, res) {
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
    async updateUtilisateur(req, res) {
        try {
            const utilisateur = await Utilisateur.findByPk(req.params.id);
            if (!utilisateur) return res.status(404).json({ message: 'Utilisateur introuvable' });
            
            const { nom, prenom, mail, phone, pwd } = req.body;
    
            // Validation des champs
            if (nom && !validator.isAlpha(nom, 'fr-FR', { ignore: " -" })) {
                return res.status(400).json({ message: 'Nom invalide : seules les lettres, espaces et tirets sont autorisés.' });
            }
            else if(nom ===''){delete req.body.nom}

            if (prenom && !validator.isAlpha(prenom, 'fr-FR', { ignore: " -" })) {
                return res.status(400).json({ message: 'Prénom invalide : seules les lettres, espaces et tirets sont autorisés.' });
            }
            else if(prenom ===''){delete req.body.prenom}

            if (mail && !validator.isEmail(mail)) {
                return res.status(400).json({ message: 'Email invalide' });
            }
            else if(mail ===''){delete req.body.mail}

            if (phone && !validator.isMobilePhone(phone, 'fr-BE')) {
                return res.status(400).json({ message: 'Numéro de téléphone invalide' });
            }
            else if(phone ===''){delete req.body.phone}

    
            // Vérifie et hache le mot de passe si fourni
            if (pwd && pwd !== '') {
                const hashedPwd = await bcrypt.hash(pwd, 10);
                req.body.pwd = hashedPwd;
            } else {
                delete req.body.pwd;
            }
    
            // Mise à jour de l'utilisateur avec les nouvelles données
            await utilisateur.update(req.body);
    
            res.json({ message: 'Utilisateur mis à jour avec succès', utilisateur });
        } catch (error) {
            console.error(error);
            res.status(400).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur' });
        }
    },
    

    // Supprimer un utilisateur
    async deleteUtilisateur(req, res) {
        try {
            const utilisateur = await Utilisateur.findByPk(req.params.id);
            if (!utilisateur) return res.status(404).json({ message: 'Utilisateur introuvable' });
            await utilisateur.destroy();
            res.json({ message: 'Utilisateur supprimé avec succès' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur' });
        }
    }
};

module.exports = UtilisateurController;
