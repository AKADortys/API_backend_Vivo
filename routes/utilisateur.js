const express = require('express');
const router = express.Router();
const UtilisateurCtrl = require('../controller/utilisateur-controller');
const authMiddleware = require('../middleware/token-check');

router.get('/getAll',authMiddleware, UtilisateurCtrl.getAllUtilisateurs);
router.get('/getUser/:id',authMiddleware, UtilisateurCtrl.getUtilisateurById);
router.put('/updateUser/:id',authMiddleware, UtilisateurCtrl.updateUtilisateur);
router.delete('/deleteUser/:id',authMiddleware, UtilisateurCtrl.deleteUtilisateur);

module.exports = router;
