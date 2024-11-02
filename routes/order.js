const express = require('express');
const router = express.Router();
const OrderController = require('../controller/OrderController');

router.get('/getAll', OrderController.getAllOrders);
router.get('/getOne/:id', OrderController.getOrderById);
router.get('/current/:user_id', OrderController.GetCurrentOrder);
router.delete('/delete/:id', OrderController.deleteOrder);
router.put('/:id/confirm', OrderController.confirmOrder);
router.put('/:id/available', OrderController.setOrderAvailable);
router.post('/:id_order/articlesAdd', OrderController.AddArticleToOrder);
router.delete('/:id_order/articlesDel', OrderController.DeleteArticleFromOrder);

module.exports = router;
