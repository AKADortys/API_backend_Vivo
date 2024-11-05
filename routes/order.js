const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/token-check');
const OrderController = require('../controller/order-controller');

router.get('/getAll',authMiddleware, OrderController.getAllOrders);
router.get('/getOrder/:id',authMiddleware, OrderController.getOrderById);
router.get('/current/:user_id',authMiddleware, OrderController.GetCurrentOrder);
router.delete('/delete/:id',authMiddleware, OrderController.deleteOrder);
router.put('/:id/confirm',authMiddleware, OrderController.confirmOrder);
router.put('/:id/available',authMiddleware, OrderController.setOrderAvailable);
router.post('/:id_order/articlesAdd',authMiddleware, OrderController.AddArticleToOrder);
router.delete('/:id_order/articlesDel',authMiddleware, OrderController.DeleteArticleFromOrder);

module.exports = router;
