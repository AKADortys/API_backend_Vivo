const express = require('express');
const router = express.Router();
const AuthController = require('../controller/auth-controller');

// Inscription
router.post('/register', AuthController.register);
// Connexion
router.post('/login', AuthController.login);
// refresh du token
router.post('/refresh', AuthController.refreshToken);
// Deconnection
router.post('/logout', AuthController.logout);


module.exports = router;