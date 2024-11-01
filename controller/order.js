const { Order, Article,User } = require("../config/dbconfig");
const validator = require("validator");

const OrderController = {
 async CheckData(data) {
    const { id_user, id_article, quantity, totalQuantity, totalPrice } = data;

    if (!validator.isInt(id_user.toString())) {
      return { valid: false, message: "L'id de l'utilisateur n'est pas valide!" };
    }
    if (!validator.isInt(id_article.toString())) {
      return { valid: false, message: "L'id de l'article n'est pas valide!" };
    }
    if (!validator.isInt(quantity.toString())) {
      return { valid: false, message: "La quantité de l'article n'est pas valide!" };
    }
    if (!validator.isFloat(totalPrice.toString())) {
      return { valid: false, message: "Le prix total de la commande n'est pas valide!" };
    }
    if (!validator.isInt(totalQuantity.toString())) {
      return { valid: false, message: "Le total de la quantité d'article n'est pas valide!" };
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
      res.status(500).json({ message: "Erreur lors de la récupération des commandes" });
    }
  },

  async getOrderById(req, res) {
    try {
      const order = await Order.findByPk(req.params.id);
      if (!order) return res.status(404).json({ message: "Commande introuvable" });
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération de la commande" });
    }
  },

  async createOrder(req, res) {
    const transaction = await Order.sequelize.transaction();
    try {
      // Validation des données entrantes
      const dataCheck = await this.CheckData(req.body);
      if (!dataCheck.valid) {
        return res.status(422).json({ message: dataCheck.message });
      }
  
      // Validation de la disponibilité de l'article
      const articleValidation = await this.validateArticle(req.body.id_article);
      if (!articleValidation.valid) {
        return res.status(422).json({ message: articleValidation.message });
      }
      
      // Vérification du stock dans createOrder
      const article = articleValidation.article;
      if (article.quantity < req.body.quantity) {
        return res.status(422).json({ message: "Stock insuffisant pour la commande!" });
      }
  
      // Création de la commande si toutes les validations sont passées
      const order = await Order.create(req.body, { transaction });
      await transaction.commit();
      res.status(201).json(order);
    } catch (err) {
      await transaction.rollback();
      res.status(500).json({ message: err.message });
    }
  }
  ,

  async updateOrder(req, res) {
    try {
      const order = await Order.findByPk(req.params.id);
      if (!order) return res.status(404).json({ message: "Commande introuvable" });

      const dataCheck = await this.CheckData(req.body);
      if (!dataCheck.valid) {
        return res.status(422).json({ message: dataCheck.message });
      }

      const articleValidation = await this.validateArticle(req.body.id_article, req.body.quantity);
      if (!articleValidation.valid) {
        return res.status(422).json({ message: articleValidation.message });
      }

      await order.update(req.body);
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la mise à jour de la commande" });
    }
  },

  async deleteOrder(req, res) {
    try {
      const order = await Order.findByPk(req.params.id);
      if (!order) return res.status(404).json({ message: "Commande introuvable" });
      await order.destroy();
      res.json({ message: "Commande supprimée avec succès" });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la suppression de la commande" });
    }
  },

  async confirmOrder(req, res) {
    try {
      const order = await Order.findByPk(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Commande introuvable" });
      }
      if (order.isConfirmed) {
        return res.status(400).json({ message: "Commande déjà confirmée" });
      }
      order.isConfirmed = true;
      await order.save();
      res.json({ message: "Commande confirmée avec succès", order });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la confirmation de la commande" });
    }
  },

  async setOrderAvailable(req, res) {
    try {
      const order = await Order.findByPk(req.params.id);
      if (!order) return res.status(404).json({ message: 'Commande introuvable' });
      order.available = true;
      await order.save();
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la mise à jour de la disponibilité de la commande" });
    }
  }
};

module.exports = OrderController;
