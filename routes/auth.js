const express = require('express');
const router = express.Router();
const AuthController = require('../controller/auth');

// Inscription
router.post('/register', AuthController.register);
// Connexion
router.post('/login', AuthController.login);

module.exports = router;