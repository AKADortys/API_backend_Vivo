const { Order, Article, User } = require("../config/dbconfig");
const { ArticleOrderController} = require("./articleOrder");
const validator = require("validator");

const OrderController = {
// Vérification de la disponibilité et du stock de l'article
async validateArticle(articleId, requiredQuantity) {
  try {
    const article = await Article.findByPk(articleId);
    if (!article) return { valid: false, message: "Article introuvable" };
    if (!article.available) return { valid: false, message: "L'article est indisponible pour la commande !" };
    if (article.quantity < requiredQuantity) return { valid: false, message: "Stock insuffisant pour la commande !" };

    // Déduction du stock temporairement pour cette opération
    article.quantity -= requiredQuantity;
    await article.save();

    return { valid: true, article };
  } catch (error) {
    return { valid: false, message: "Erreur lors de la vérification de l'article", error: error.message };
  }
},
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

  async GetCurrentOrder(user_id) {
    try{
      if (!user_id || isInt(user_id)) return res.status(404).json({ message : "paramètre manquant ou invalide ! user_id"})
      const user = await User.findByPk(user_id);
      if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
      const order = await Order.findOne({where:{id_user : user_id, isConfirmed : false}})
      if(!order)
        {
          const newOrder = await Order.create({id_user : user_id});
          return newOrder;
        }
    } catch(error){
      res.status(500).json({ message: "Erreur lors de la récupération de la commande en cours", error });
    }
  },

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
  },
  async AddArticleToOrder(req, res) {
    try {
      const order = await Order.findByPk(req.params.id_order);
      if (!order) return res.status(404).json({ message: "Commande introuvable" });
  
      const { id_article, quantity } = req.body;
  
      if (!id_article || !quantity || isNaN(quantity)) {
        return res.status(400).json({ message: "ID d'article ou quantité invalide" });
      }
  
      const articleValidation = await this.validateArticle(id_article, quantity);
      if (!articleValidation.valid) return res.status(400).json({ message: articleValidation.message });
  
      // Mettre à jour les totaux de la commande
      order.totalQuantity += quantity;
      order.totalPrice += articleValidation.article.price * quantity;
  
      await order.save();
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de l'ajout de l'article à la commande", error: error.message });
    }
  }
    
};

module.exports = OrderController;
