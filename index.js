require('dotenv').config();
const express = require('express');
const cors = require('cors');
// ici on utilise le nullish coallescing operator
// https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator
const port = process.env.PORT ?? 3000;
const router = require('./app/router');
const app = express();

// CORS: Cross-origin resource sharing
// de base on ne peut faire requêtes sur notre serveur
// que depuis http://localhost:5000 pour un souci de sécurité
// néanmoins, on peut "ouvrir" ce partage de data à d'autres serveurs
// on peut ouvrir à tout le monde avec le wild card "*" ou à certains serveurs
/*var corsOptions = {
  origin: ['null', 'https://www.google.fr', 'https://lequipe.fr'],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}*/

const multer = require('multer');
const bodyParser = multer();

app
  .use(cors())
  .use(express.urlencoded({ extended: true }))
  .use(express.json())
  .use(express.static('./public'))
  .use(bodyParser.none())
  .use(router)
  // middleware de traitement des erreurs
  // on passe dedans quand on passe un argument à next(err)
  // http://expressjs.com/fr/guide/error-handling.html#traitement-derreurs
  .use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).json({
      message: 'Something broke!',
      ok: false
    });
  });

app.listen(port, () => {
  console.log(`app is runinng http://localhost:${port}`);
});