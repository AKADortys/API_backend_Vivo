const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');


const app = express();

app.use(bodyParser.json());
app.use(cors());
// Middleware pour utiliser les routes
app.use('/user', require('./routes/utilisateur'));
app.use('/article',require('./routes/article'));
app.use('/order',require('./routes/order'));
app.use('/auth',require('./routes/auth'));


app.listen(3000, () => {
    console.log(`Serveur en cours d'exécution sur le port http://localhost:3000}`);
});
