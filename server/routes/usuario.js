

/* Usado para iniciar el servidor */
const express = require('express');

/* Este modulo es usado para encriptar la contraseña, en este caso
se realiza una encriptacion de metodo de una sola via */
const bcrypt = require('bcrypt');

/* Este modulo se utiliza para obtener los elementos del body de la peticion put que se pueden modificar, es decir, solo tomara los datos que son modificables */
const _ = require('underscore');


/* Modelo usuario */
const Usuario = require('../models/usuario');

/* inicializacion de express */
const app = express();



/* Método get, permite obtener todos los usuario guardados en la base de datos */
app.get('/usuario', function (req, res) {
    res.json('get usuario local')
});

/* Método post, permite agregar un nuevo registro a la tabla usuario*/
  
app.post('/usuario', function (req, res) {
  
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err,usuarioDB) =>{
        if(err){
        return res.status(400).json({
                ok:false,
                err
            })
        }

        res.json({
            ok:true,
            usuario: usuarioDB
        })
    });  
  });

/* Método put, permite modificar los datos de un usuario según su id, se hace uso del modulo underscore para obtener solo los atributos que se pueden modificar del usuario */
  
app.put('/usuario/:id', function (req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, {new: true, runValidators:true, context:'query'}, (err, usuarioDB) =>{

        if(err){
            return res.status(400).json({
                ok:false,
                err
            })
        }

        res.json({
            usuario: usuarioDB
        })
    })  
});


/* Delete, permite eliminar un usuario de los registros de la base de datos */
  
app.delete('/usuario', function (req, res) {
    res.json('delete usuario')
});


/* Exportando el objeto app para ser accedido desde cualquier otro archivo */
module.exports = app;