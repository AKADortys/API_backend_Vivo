const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');

module.exports = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(403).json({ message: 'Token manquant' });

    try {
        const decoded = jwt.verify(token, jwtConfig.secret);
        req.userId = decoded.id;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token invalide' });
    }
};
