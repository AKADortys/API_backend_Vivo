const { Order, Article, User, ArticleOrder } = require("../config/dbconfig");
const validator = require("validator");

const OrderController = {
  async validateArticle(articleId, requiredQuantity) {
    try {
      const result = await sequelize.transaction(async (t) => {
        const article = await Article.findByPk(articleId, { transaction: t });
        if (!article) return { valid: false, message: "Article introuvable" };
        if (!article.available)
          return {
            valid: false,
            message: "L'article est indisponible pour la commande !",
          };
        if (article.quantity < requiredQuantity)
          return {
            valid: false,
            message: "Stock insuffisant pour la commande !",
          };

        // Mettre à jour la quantité dans la même transaction
        article.quantity -= requiredQuantity;
        await article.save({ transaction: t });

        return { valid: true, article };
      });
      return result;
    } catch (error) {
      return {
        valid: false,
        message: "Erreur lors de la vérification de l'article",
        error: error.message,
      };
    }
  },
  async CheckData(data) {
    const { id_user, id_article, quantity, totalQuantity, totalPrice } = data;

    if (!validator.isInt(id_user.toString())) {
      return {
        valid: false,
        message: "L'id de l'utilisateur n'est pas valide!",
      };
    }
    if (!validator.isInt(id_article.toString())) {
      return { valid: false, message: "L'id de l'article n'est pas valide!" };
    }
    if (!validator.isInt(quantity.toString())) {
      return {
        valid: false,
        message: "La quantité de l'article n'est pas valide!",
      };
    }
    if (!validator.isFloat(totalPrice.toString())) {
      return {
        valid: false,
        message: "Le prix total de la commande n'est pas valide!",
      };
    }
    if (!validator.isInt(totalQuantity.toString())) {
      return {
        valid: false,
        message: "Le total de la quantité d'article n'est pas valide!",
      };
    }
    const user = await User.findByPk(id_user);
    if (!user) {
      return { valid: false, message: "L'utilisateur est introuvable!" };
    }

    return { valid: true };
  },

  async getAllOrders(req, res) {
    try {
      const orders = await Order.findAll();
      res.json(orders);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur lors de la récupération des commandes" });
    }
  },

  async getOrderById(req, res) {
    try {
      const order = await Order.findByPk(req.params.id);
      if (!order)
        return res.status(404).json({ message: "Commande introuvable" });
      res.json(order);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur lors de la récupération de la commande" });
    }
  },
  async GetCurrentOrder(user_id) {
    try {
      if (!user_id || !validator.isInt(user_id.toString())) {
        return {
          valid: false,
          message: "paramètre manquant ou invalide: user_id",
        };
      }
      const user = await User.findByPk(user_id);
      if (!user) return { valid: false, message: "Utilisateur introuvable" };

      let order = await Order.findOne({
        where: { id_user: user_id, isConfirmed: false },
      });
      if (!order) {
        order = await Order.create({ id_user: user_id });
      }
      return { valid: true, order };
    } catch (error) {
      return {
        valid: false,
        message: "Erreur lors de la récupération de la commande en cours",
        error: error.message,
      };
    }
  },
  async deleteOrder(req, res) {
    try {
      const order = await Order.findByPk(req.params.id);
      if (!order)
        return res.status(404).json({ message: "Commande introuvable" });
      await order.destroy();
      res.json({ message: "Commande supprimée avec succès" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur lors de la suppression de la commande" });
    }
  },
  async confirmOrder(req, res) {
    try {
      const result = await sequelize.transaction(async (t) => {
        const order = await Order.findByPk(req.params.id, { transaction: t });
        if (!order)
          return res.status(404).json({ message: "Commande introuvable" });
        if (order.isConfirmed)
          return res.status(400).json({ message: "Commande déjà confirmée" });

        order.isConfirmed = true;
        await order.save({ transaction: t });

        return res.json({ message: "Commande confirmée avec succès", order });
      });
      return result;
    } catch (error) {
      res
        .status(500)
        .json({
          message: "Erreur lors de la confirmation de la commande",
          error: error.message,
        });
    }
  },

  async setOrderAvailable(req, res) {
    try {
      const order = await Order.findByPk(req.params.id);
      if (!order)
        return res.status(404).json({ message: "Commande introuvable" });
      order.available = true;
      await order.save();
      res.json(order);
    } catch (error) {
      res
        .status(500)
        .json({
          message:
            "Erreur lors de la mise à jour de la disponibilité de la commande",
        });
    }
  },
  async AddArticleToOrder(req, res) {
    try {
      const result = await sequelize.transaction(async (t) => {
        const order = await Order.findByPk(req.params.id_order, { transaction: t });
        if (!order) return res.status(404).json({ message: "Commande introuvable" });
  
        const { id_article, quantity } = req.body;
        if (!id_article || !quantity || isNaN(quantity) || quantity <= 0) {
          return res.status(400).json({ message: "ID d'article ou quantité invalide" });
        }
  
        const articleValidation = await this.validateArticle(id_article, quantity);
        if (!articleValidation.valid) return res.status(400).json({ message: articleValidation.message });
  
        order.totalQuantity += quantity;
        order.totalPrice += articleValidation.article.price * quantity;
  
        await ArticleOrder.create({
          articleId: articleValidation.article.id,
          orderId: order.id,
          label: articleValidation.article.label,
          price: articleValidation.article.price,
          quantity: quantity,
        }, { transaction: t });
        
        await order.save({ transaction: t });
        return order;
      });
  
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de l'ajout de l'article", error: error.message });
    }
  },
  async DeleteArticleFromOrder(req, res) {
    try {
      // Rechercher la commande par ID
      const order = await Order.findByPk(req.params.id_order);
      if (!order)
        return res.status(404).json({ message: "Commande introuvable" });

      // Récupérer l'ID de l'article à supprimer depuis le corps de la requête
      const { id_article } = req.body;
      if (!id_article) {
        return res.status(400).json({ message: "ID d'article manquant" });
      }

      // Rechercher l'article dans ArticleOrder pour cette commande
      const articleOrder = await ArticleOrder.findOne({
        where: {
          orderId: order.id,
          articleId: id_article,
        },
      });

      // Si l'article n'est pas trouvé dans la commande
      if (!articleOrder) {
        return res
          .status(404)
          .json({ message: "Article non trouvé dans la commande" });
      }

      // Mise à jour des totaux de la commande
      order.totalQuantity -= articleOrder.quantity;
      order.totalPrice -= articleOrder.price * articleOrder.quantity;

      // Assurer que les valeurs ne soient pas négatives
      if (order.totalQuantity < 0) order.totalQuantity = 0;
      if (order.totalPrice < 0) order.totalPrice = 0;

      // Sauvegarder la commande mise à jour
      await order.save();

      // Restituer la quantité de l'article de la commande à la quantité de l'article
      const article = await Article.findOne({
        where: { id: articleOrder.articleId },
      });
      article.quantity += articleOrder.quantity;

      // Supprimer l'article de la table ArticleOrder
      await articleOrder.destroy();

      res.json(order);
    } catch (error) {
      console.error(
        "Erreur lors de la suppression de l'article de la commande :",
        error
      ); // Log pour le serveur
      res
        .status(500)
        .json({
          message: "Erreur lors de la suppression de l'article de la commande",
          error: error.message,
        });
    }
  },
};

module.exports = OrderController;
