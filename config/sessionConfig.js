const secret = process.env.SESSION_SECRET || "Devmode";
const timeout = parseInt(process.env.SESSION_TIMEOUT) || 60000;

module.exports = {
  secret: secret,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: true, // `true` uniquement en production
    httpOnly: true,
    maxAge: timeout,
    sameSite: 'lax' // 'strict' ou 'none' selon votre politique cross-origin
  }
};
