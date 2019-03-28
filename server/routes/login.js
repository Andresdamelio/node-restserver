

/* Modulos importados */

const express = require('express');
const bcrypt = require('bcrypt');
const usuario = require('../models/usuario');
const app = express();

app.post('/login', (req, res) => {

    let body = req.body;

    usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if ( !usuarioDB ) {
            return res.status(400).json({
                ok:false,
                err: {
                    message: '(Usuario) o contraseña incorrectos'
                }
            })
        }

       if( !bcrypt.compareSync( body.password, usuarioDB.password )){
        return res.status(400).json({
            ok:false,
            err: {
                message: 'Usuario (o contraseña) incorrectos'
            }
        })
       }

       res.json({
            ok:true,
            usuario: usuarioDB,
            token:'123'
        })
    })
});



/* Exportar app para que pueda ser usado en cualquier otro lado */
module.exports = app;