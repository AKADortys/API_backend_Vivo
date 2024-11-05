const crypto = require('crypto');
const secret1 = crypto.randomBytes(64).toString('hex');
const secret = process.env.TOKEN_SECRET || secret1; 
const expireIn = process.env.TOKEN_TIMEOUT || "1h"
module.exports = {
    secret: secret,
    expiresIn: expireIn, // Durée de validité du token
};
