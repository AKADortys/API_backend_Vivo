const { Article } = require('../config/dbconfig');
const validator =require('validator');


const ArticleController = {

    checkdata(data) {
        const {label, content, price, quantity, available } =data;
        
        if (!validator.isLength(label, { min: 5 })) {
            return { valid: false, message: "Le label doit contenir au moins 5 caractères !" };
        }
        
        if (!validator.isLength(content, { min: 10 })) {
            return { valid: false, message: "Le contenu doit contenir au moins 10 caractères!" };
        }
        
        if (!validator.isFloat(price)) {
            return { valid: false, message: "Le prix doit être un chiffre à virgule !" };
        }
        
        if (!validator.isInt(quantity)) {
            return { valid: false, message: "La quantité doit être un entier !" };
        }
        
        if (!validator.isBoolean(available)) {
            return { valid: false, message: "L'état de disponibilité doit être un booléen!" };
        }
        
        return { valid: true };
    },

    async getAllArticles(req, res) {
        try {
            const articles = await Article.findAll();
            res.json(articles);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async getArticleById(req, res) {
        try {
            const article = await Article.findByPk(req.params.id);
            if (!article) return res.status(404).json({ error: 'Article introuvable' });
            res.json(article);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async addArticle(req, res) {
        try {
            const { valid, message } = ArticleController.checkdata(req.body);
            if (!valid) return res.status(400).json({ message });
            const article = await Article.create(req.body);
            res.status(201).json(article);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    async updateArticle(req, res) {
        try {
            const article = await Article.findByPk(req.params.id);
            if (!article) return res.status(404).json({ error: 'Article introuvable' });
            const { valid, message } = ArticleController.checkdata(req.body);
            if (!valid) return res.status(400).json({ message });
            await article.update(req.body);
            res.json(article);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    async deleteArticle(req, res) {
        try {
            const article = await Article.findByPk(req.params.id);
            if (!article) return res.status(404).json({ error: 'Article introuvable' });
            await article.destroy();
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = ArticleController;