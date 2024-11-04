const crypto = require('crypto');
const secret1 = crypto.randomBytes(64).toString('hex');
const secret = process.env.TOKEN_SECRET || secret1; 
module.exports = {
    secret: secret,
    expiresIn: '1h', // Durée de validité du token
};
