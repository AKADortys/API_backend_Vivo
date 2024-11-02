const express = require('express');
const router = express.Router();
const ArticleController = require('../controller/article')

router.get('/getAll',ArticleController.getAllArticles);
router.get('/getArticle/:id',ArticleController.getArticleById);
router.post('/createArticle',ArticleController.addArticle);
router.put('/updateArticle/:id',ArticleController.updateArticle);
router.delete('/delete/:id',ArticleController.deleteArticle);

module.exports = router;