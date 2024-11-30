const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/token-check');
const ArticleOrderController = require("../controller/articleOrder-controller");

router.get('/article/:orderId',authMiddleware, ArticleOrderController.getArticleOrders);

module.exports = router;