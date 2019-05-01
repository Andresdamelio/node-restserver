const express = require('express')
const app = express()
const Categoria = require('../models/categoria')
const { verificationToken, verificationAdmin } = require('../middlewares/autenticacion')


/* Mostar todas las categorias */
app.get('/categoria', verificationToken, (req, res)=>{
    Categoria.find({}, (err, categorias) => {
        if( err ){
            return res.status(400).json({
                of:false,
                err
            })
        }

        if( !categorias ){
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'No hay categorias registradas'
                }
            })
        }

        res.json({
            ok:true,
            categorias
        })
    })
})

/* Mostar una categoria por id */
app.get('/categoria/:id', verificationToken, (req, res)=>{
    let id = req.params.id

    Categoria.findById(id, (err, categoria) => {
        if( err ){
            return res.status(200).json({
                ok: false,
                err
            })
        }

        if( !categoria ){
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'Categoria no encontrada'
                }
            })
        }

        res.json({
            ok: true,
            categoria
        })
    })
})

/* Crear una nueva categoria */
app.post('/categoria', [verificationToken,verificationAdmin], (req, res)=>{
    let body = req.body;
    let usuario = req.usuario._id;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: usuario
    })

    categoria.save( (err, categoriaBD)=>{
        if( err ){
            return res.status(400).json({
                ok:false,
                err
            })
        }

        res.json({
            ok:true,
            categoria: categoriaBD
        })
    })
})


/* Actualizar una categoria */
app.put('/categoria/:id', [verificationToken, verificationAdmin], (req, res)=>{
    
    let id = req.params.id
    let body = req.body

    Categoria.findByIdAndUpdate(id, body, {new: true, runValidators:true, context:'query'}, (err, categoriaBD)=>{
        if( err ){
            return res.status(400).json({
                ok:false,
                err
            })
        }

        res.json({
            ok:true,
            categoria: categoriaBD
        })
    })
})

/* Borrar una categoria (eliminado fisico) */
app.delete('/categoria/:id',  verificationToken, (req, res)=>{
    let id = req.params.id

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada)=>{
        if( err ){
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if( !categoriaBorrada ){
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'Error, categoria no encontrada'
                }
            })
        }

        res.json({
            ok:true,
            categoriaBorrada
        })
    })
})



module.exports = app;