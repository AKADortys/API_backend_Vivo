const { Utilisateur } = require('../config/dbconfig');
const validator = require('validator');

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

    // Mettre à jour un utilisateur
    async updateUtilisateur(req, res) {
        try {
            const utilisateur = await Utilisateur.findByPk(req.params.id);
            if (!utilisateur) return res.status(404).json({ message: 'Utilisateur introuvable' });
            
            const validation = this.CheckData(req.body);
            if (!validation.valid) return res.status(400).json({ message: validation.message });
            
            await utilisateur.update(req.body);
            res.json(utilisateur);
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
