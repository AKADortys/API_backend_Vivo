const { ArticleOrder } = require('../config/dbconfig');
const validator = require('validator');

const ArticleOrderController = {
  // Validation des données de l'article dans la commande
  checkData(data) {
    const { articleId, orderId, label, price, quantity } = data;

    if (!validator.isInt(articleId.toString())) {
      return { valid: false, message: "L'ID de l'article n'est pas valide !" };
    }
    if (!validator.isInt(orderId.toString())) {
      return { valid: false, message: "L'ID de la commande n'est pas valide !" };
    }
    if (!validator.isFloat(price.toString())) {
      return { valid: false, message: "Le prix de l'article n'est pas valide !" };
    }
    if (!validator.isInt(quantity.toString())) {
      return { valid: false, message: "La quantité de l'article n'est pas valide !" };
    }
    if (!label || label.trim() === "") {
      return { valid: false, message: "Le label de l'article est obligatoire !" };
    }

    return { valid: true };
  },


  // Création d'un article dans une commande
  async createArticleOrder(req, res) {
    const { articleId, orderId, label, price, quantity } = req.body;

    const dataCheck = this.checkData(req.body);
    if (!dataCheck.valid) {
      return res.status(422).json({ message: dataCheck.message });
    }

    const articleValidation = await this.validateArticle(articleId, quantity);
    if (!articleValidation.valid) {
      return res.status(422).json({ message: articleValidation.message });
    }

    try {
      const articleOrder = await ArticleOrder.create({ articleId, orderId, label, price, quantity });
      res.status(201).json(articleOrder);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de l'ajout de l'article à la commande" });
    }
  },


  // Mise à jour d'un article dans une commande
  async updateArticleOrder(req, res) {
    const { articleId, orderId } = req.body;

    const dataCheck = this.checkData(req.body);
    if (!dataCheck.valid) {
      return res.status(422).json({ message: dataCheck.message });
    }

    try {
      const articleOrder = await ArticleOrder.findOne({
        where: { articleId: req.params.articleId, orderId: req.params.orderId }
      });
      if (!articleOrder) return res.status(404).json({ message: "Article de commande introuvable" });

      if (quantity && quantity !== articleOrder.quantity) {
        const articleValidation = await this.validateArticle(articleId, quantity);
        if (!articleValidation.valid) {
          return res.status(422).json({ message: articleValidation.message });
        }
      }

      await articleOrder.update({ label, price, quantity });
      res.json(articleOrder);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la mise à jour de l'article de commande" });
    }
  },

  // Suppression d'un article dans une commande
  async deleteArticleOrder(req, res) {
    try {
      const articleOrder = await ArticleOrder.findOne({
        where: { articleId: req.params.articleId, orderId: req.params.orderId }
      });
      if (!articleOrder) return res.status(404).json({ message: "Article de commande introuvable" });

      await articleOrder.destroy();
      res.json({ message: "Article de commande supprimé avec succès" });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la suppression de l'article de commande" });
    }
  }
};

module.exports = ArticleOrderController;
