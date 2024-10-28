const {Utilisateur} = require('../config/dbconfig');

let UtilisateurController = {
    //retourne tout les utilisateurs
    async getAllUtilisateurs(req, res) {
        try {
            const utilisateurs = await Utilisateur.findAll();
            res.json(utilisateurs);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs' });
        }
    },
    //Recherche sur id
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
    //Ajouter
    async addUtilisateur(req, res) {
        try {
            const utilisateur = await Utilisateur.create(req.body);
            res.status(201).json(utilisateur);
        } catch (error) {
            console.error(error);
            res.status(400).json({ message: 'Erreur lors de l\'ajout de l\'utilisateur' });
        }
    },
    //Modifier
    async updateUtilisateur(req, res) {
        try {
            const utilisateur = await Utilisateur.findByPk(req.params.id);
            if (!utilisateur) return res.status(404).json({ message: 'Utilisateur introuvable' });
            await utilisateur.update(req.body);
            res.json(utilisateur);
        } catch (error) {
            console.error(error);
            res.status(400).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur' });
        }
    },
    //Supprimer
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
    
}

module.exports = UtilisateurController;