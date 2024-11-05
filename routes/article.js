const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/token-check');
const ArticleController = require('../controller/article-controller')

router.get('/getAll',ArticleController.getAllArticles);
router.get('/getArticle/:id',ArticleController.getArticleById);
router.post('/createArticle',authMiddleware,ArticleController.addArticle);
router.put('/updateArticle/:id',authMiddleware,ArticleController.updateArticle);
router.delete('/delete/:id',authMiddleware,ArticleController.deleteArticle);

module.exports = router;