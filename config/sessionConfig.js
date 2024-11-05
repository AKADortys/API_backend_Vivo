const secret = process.env.SESSION_SECRET || "Devmode";
const timeout = parseInt(process.env.SESSION_TIMEOUT) || 60000;

module.exports = {
  secret: secret,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true, httpOnly: true, maxAge: timeout },
};
