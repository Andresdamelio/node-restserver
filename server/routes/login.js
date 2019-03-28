

/* Modulos importados */

const express = require('express');
const bcrypt = require('bcrypt');
const usuario = require('../models/usuario');
const app = express();

app.post('/login', (req, res) => {

    /* Se obtiene el cuerpo de la petición para tomar el correo y la contraseña ingresada */

    let body = req.body;

    /* usuario.findOne devuelve un solo usuario, en este caso se le pasa la condicion de que se email sea el ingresado, y el callback con el error o el usuario */

    usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        /* Se verifica si no ocurrió algún error con la base de datos o el servdor, y se envia un error 500 en caso de que exista  */

        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }

        /* Se verifica si el usuario ingresado existe, en caso de no existir se envia el error 400 */

        if ( !usuarioDB ) {
            return res.status(400).json({
                ok:false,
                err: {
                    message: '(Usuario) o contraseña incorrectos'
                }
            })
        }

        /* Se verifica que la contraseña ingresada coincida con la que esta guardada en la base de datos, en este caso se utiliza bcrypt.compareSync que permite comparar las dos contraseñas, este mismo se encarga de encriptar la ingresada y compararla con la existente. */

       if( !bcrypt.compareSync( body.password, usuarioDB.password )){
        return res.status(400).json({
            ok:false,
            err: {
                message: 'Usuario (o contraseña) incorrectos'
            }
        })
       }

       /* En caso de que no ocurra ningún incoveniente, se envia la respuesta positiva, con un estatus 200, ademas se envia el usuario y el token de acceso */

       res.json({
            ok:true,
            usuario: usuarioDB,
            token:'123'
        })
    })
});



/* Exportar app para que pueda ser usado en cualquier otro lado */
module.exports = app;