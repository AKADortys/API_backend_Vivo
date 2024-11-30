const ArticleOrderController = {};
const { ArticleOrder } = require('../config/dbconfig')

ArticleOrderController.getArticleOrders = async function (req, res)  {
    const orderId = req.params.orderId;
    try {
        //Recherche des articles liées à la commande
        const articleOrders = await ArticleOrder.findAll({ where: { orderId: orderId }});
        if (!articleOrders) {
            res.json({ok: false , error: "Commande non trouvée"});
        }
        res.json({ok: true, articleOrders});
        
    } catch (error) {
        res.json({ok: false , error : error.message});
    }
}

module.exports = ArticleOrderController;