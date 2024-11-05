const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/token-check');
const NewsletterController =require('../controller/newsletter-controller')

router.get('/getAll',authMiddleware,NewsletterController.getNewsletters)
router.post('/add',NewsletterController.addNewsletter)
router.put('/status',authMiddleware,NewsletterController.updateActiveNewsletter)
router.delete('/delete',authMiddleware,NewsletterController.deleteNewsletter)

module.exports = router;