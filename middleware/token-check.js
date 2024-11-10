const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwtConfig");

module.exports = (req, res, next) => {
  let token = req.headers||""; // Accède d'abord au token de session
  
  console.log("étape1\n\n")
  // Vérifie d'abord le token dans la session si non présent dans les en-têtes
  if (!token && req.session && req.session.accessToken) {
    token = req.session.accessToken;
  }

  // Validation de l'en-tête Authorization
  if (token && token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  } else if (!token) {
    return res.status(403).json({ message: "Token manquant" });
  }

  try {
    // Vérifie et décode le token
    const decoded = jwt.verify(token, jwtConfig.secret);
    req.userId = decoded.id;
    next();
  } catch (error) {
    // Gère les erreurs spécifiques liées au token
    if (error.name === "TokenExpiredError") {
      res.status(401).json({ message: "Token expiré, veuillez rafraîchir" });
    } else if (error.name === "JsonWebTokenError") {
      res.status(401).json({ message: "Token invalide" });
    } else {
      res.status(500).json({ message: "Erreur d'authentification" });
    }
    console.error("Erreur JWT:", error); // Log d'erreur pour débogage
  }
};
