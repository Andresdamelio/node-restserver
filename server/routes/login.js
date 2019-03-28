

/* Modulos importados */

const express = require('express');
const bcrypt = require('bcrypt');
const usuario = require('../models/usuario');
const app = express();

app.post('/login', (req, res) => {
    res.json({
        ok:true
    })
});



/* Exportar app para que pueda ser usado en cualquier otro lado */
module.exports = app;