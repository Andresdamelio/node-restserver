

/* Modulo usados */

const express = require('express');
const app = express();


/* Definición de rutas de la aplicación */

app.use(require('./usuario'));
app.use(require('./login'));
app.use(require('./categoria'));
app.use(require('./producto'));

/* Exportar app */

module.exports = app;