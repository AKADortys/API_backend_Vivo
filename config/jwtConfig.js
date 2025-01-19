const secret = process.env.TOKEN_SECRET;
const expireIn = process.env.TOKEN_TIMEOUT || "1h";
const refreshSecret = process.env.TOKEN_REFRESH_SECRET || "development";
module.exports = {
  secret: secret,
  expiresIn: expireIn, // Durée de validité du token
  refreshSecret: refreshSecret,
};
