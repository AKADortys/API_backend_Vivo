const { Article } = require('../model/article');

const ArticleController = {
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
            if (!article) return res.status(404).json({ error: 'Article not found' });
            res.json(article);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async addArticle(req, res) {
        try {
            const article = await Article.create(req.body);
            res.status(201).json(article);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    async updateArticle(req, res) {
        try {
            const article = await Article.findByPk(req.params.id);
            if (!article) return res.status(404).json({ error: 'Article not found' });
            await article.update(req.body);
            res.json(article);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    async deleteArticle(req, res) {
        try {
            const article = await Article.findByPk(req.params.id);
            if (!article) return res.status(404).json({ error: 'Article not found' });
            await article.destroy();
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = ArticleController;