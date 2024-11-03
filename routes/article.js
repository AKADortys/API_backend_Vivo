const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const ArticleController = require('../controller/article')

router.get('/getAll',ArticleController.getAllArticles);
router.get('/getArticle/:id',ArticleController.getArticleById);
router.post('/createArticle',authMiddleware,ArticleController.addArticle);
router.put('/updateArticle/:id',authMiddleware,ArticleController.updateArticle);
router.delete('/delete/:id',authMiddleware,ArticleController.deleteArticle);

module.exports = router;