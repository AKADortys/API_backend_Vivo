const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');

module.exports = (req, res, next) => {
    let token = req.headers.authorization

    if (token && token.startsWith("Bearer ")) {
        token = token.split(' ')[1];
    } else {
        return res.status(403).json({ message: 'Token manquant' });
    }



    try {
        const decoded = jwt.verify(token, jwtConfig.secret);
        req.userId = decoded.id;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token invalide' });
    }
};
