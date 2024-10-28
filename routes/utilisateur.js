const express = require('express');
const router = express.Router();
const UtilisateurCtrl = require('../controller/utilisateur');

router.get('/getAll', UtilisateurCtrl.getAllUtilisateurs);
router.get('/getUser/:id', UtilisateurCtrl.getUtilisateurById);
router.post('/addUser', UtilisateurCtrl.addUtilisateur);
router.put('/updateUser/:id', UtilisateurCtrl.updateUtilisateur);
router.delete('/deleteUser/:id', UtilisateurCtrl.deleteUtilisateur);

module.exports = router;
