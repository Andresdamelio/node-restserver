

/* Usado para iniciar el servidor */
const express = require('express');

/* Este modulo es usado para encriptar la contraseña, en este caso
se realiza una encriptacion de metodo de una sola via */
const bcrypt = require('bcrypt');

/* Este modulo se utiliza para obtener los elementos del body de la peticion put que se pueden modificar, es decir, solo tomara los datos que son modificables */
const _ = require('underscore');


/* Modelo usuario */
const Usuario = require('../models/usuario');

/* middlewares */
const {  verificationToken, verificationAdmin } = require('../middlewares/autenticacion');

/* inicializacion de express */
const app = express();



/* Método get, permite obtener todos los usuario guardados en la base de datos */

app.get('/usuario', verificationToken, (req, res) => {


    /* obtener el parametro recibido en la url, en este caso, el inicio de la busqueda, este se encarga de buscar los usuarios a partir del indicado en el parametro, en caso contrario empieza en 0 */
    let desde = req.query.desde || 0;
    desde = Number(desde);


    /* Numero de registros a buscar, este indica la cantidad de registros que se muestran por paginación, si no se especifica se toma como default el 5 */

    let limite = req.query.limite || 5;
    limite = Number(limite);

    
    /* El segundo argumento sirve para filtrar los datos que queremos mostrar, en este caso, la petición enviará solo el nombre, email y role de cada usuario */

    Usuario.find({estado: true}, 'nombre email role estado')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if(err){
                return res.status(400).json({
                    ok:false,
                    err
                })
            }

            Usuario.countDocuments({estado: true}, (err, conteo)=>{
                res.json({
                    ok:true,
                    usuarios,
                    registros:conteo
                });
            });  
        })
});


/* Método post, permite agregar un nuevo registro a la tabla usuario*/
  
app.post('/usuario', [verificationToken, verificationAdmin], (req, res) => {
  
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
  
app.put('/usuario/:id', [verificationToken, verificationAdmin], (req, res) => {

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



/* Delete, permite eliminar un usuario de los registros de la base de datos (Eliminacón fisica, y logica) */
  
app.delete('/usuario/:id', [verificationToken, verificationAdmin], (req, res) => {
    
    let id = req.params.id;

    let cambiaEstado = {
        estado:false
    }

    //Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    Usuario.findByIdAndUpdate(id, cambiaEstado, {new: true}, (err, usuarioBorrado) => {
        if(err){
            return res.status(400).json({
                ok:false,
                err
            })
        }

        if( !usuarioBorrado ){
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'Usuario no encontrado'
                }
            })   
        }

        res.json({
            ok:true,
            usuario: usuarioBorrado
        });
    })



});


/* Exportando el objeto app para ser accedido desde cualquier otro archivo */
module.exports = app;


