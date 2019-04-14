

/* Modulos importados */

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client( process.env.CLIENT_ID );
const Usuario = require('../models/usuario');
const app = express();

app.post('/login', (req, res) => {

    /* Se obtiene el cuerpo de la petición para tomar el correo y la contraseña ingresada */

    let body = req.body;

    /* usuario.findOne devuelve un solo usuario, en este caso se le pasa la condicion de que se email sea el ingresado, y el callback con el error o el usuario */

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

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


       /* Generación de token, utilizando el paquete jsonwebtoken */


       let token = jwt.sign({
          usuario: usuarioDB,
       }, process.env.SEED, { expiresIn: process.env.EXPIRATION_TOKEN });

       /* En caso de que no ocurra ningún incoveniente, se envia la respuesta positiva, con un estatus 200, ademas se envia el usuario y el token de acceso */

       res.json({
            ok:true,
            usuario: usuarioDB,
            token
        })
    })
});


/* configuraciones de google */

async function verify( token ) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
  }

app.post('/google', async (req, res) => {
    
 let token = req.body.idtoken;

 let googleUser = await verify( token )
        .catch( err => {
            return res.status(403).json({
                ok:false,
                err
            });
        });


 Usuario.findOne( {email: googleUser.email}, (err, usuarioDB) => {
    
    if(err){
        return res.status(500).json({
            ok:false,
            err
        })
    }

    if( usuarioDB ){

        if( !usuarioDB.google ) {
            return res.status(400).json({
                ok:false,
                err: {
                    message: 'Debe usar su autenticación normal'
                }
            })
        }
        else{
            let token = jwt.sign({
                usuario: usuarioDB,
             }, process.env.SEED, { expiresIn: process.env.EXPIRATION_TOKEN });

             return res.json({
                 ok: true,
                 usuario: usuarioDB,
                 token
             })
        }
    }else{
        
        //Si el usuario no existe en la base de datos
        let usuario = new Usuario({
            nombre: googleUser.name,
            email:  googleUser.email,
            img:    googleUser.picture,
            google: googleUser.google,
            password: bcrypt.hashSync('password', 10),
        });
        
        usuario.save( (err, usuarioDB) => {
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                })
            }

            let token = jwt.sign({
                usuario: usuarioDB,
             }, process.env.SEED, { expiresIn: process.env.EXPIRATION_TOKEN });

             return res.json({
                 ok: true,
                 usuario: usuarioDB,
                 token
             })
        } )
    }

  });

});



/* Exportar app para que pueda ser usado en cualquier otro lado */
module.exports = app;