const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwtConfig");

module.exports = (req, res, next) => {
  let token = req.headers.authorization;

  // Vérifie d'abord le token en session
  if (!token && req.session && req.session.token) {
    token = req.session.token;
  }

  if (token && token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  } else if (!token) {
    return res.status(403).json({ message: "Token manquant" });
  }

  try {
    const decoded = jwt.verify(token, jwtConfig.secret);
    req.userId = decoded.id;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res.status(401).json({ message: "Token expiré, veuillez rafraîchir" });
    } else if (error.name === "JsonWebTokenError") {
      res.status(401).json({ message: "Token invalide" });
    } else {
      res.status(500).json({ message: "Erreur d'authentification" });
    }
  }
};
