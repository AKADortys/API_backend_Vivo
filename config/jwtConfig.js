const crypto = require('crypto');
const secret = crypto.randomBytes(64).toString('hex');

module.exports = {
    secret: "Test phase à modifier impérativement",
    expiresIn: '1h', // Durée de validité du token
};
