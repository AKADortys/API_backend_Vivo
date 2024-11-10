const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const session = require('express-session');

dotenv.config(); 

const app = express();
app.use(session(require('./config/sessionConfig')));
app.use(bodyParser.json());
app.use(cors({
    credentials: true
}));


app.use('/user', require('./routes/utilisateur'));
app.use('/article', require('./routes/article'));
app.use('/order', require('./routes/order'));
app.use('/auth', require('./routes/auth'));
app.use('/newsletter', require('./routes/newsletter'));

app.listen(3000, () => {
    console.log(`Serveur en cours d'exécution sur le port http://localhost:3000`);
});
