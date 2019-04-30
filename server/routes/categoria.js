const express = require('express')
const app = express()
const Categoria = require('../models/categoria')
const { verificationToken } = require('../middlewares/autenticacion')


/* Mostar todas las categorias */
app.get('/categoria', verificationToken (req, res)=>{
    Categoria.find({})
    .excec((err, categoriass) => {
        if( err ){
            return res.status(400).json({
                of:false,
                err
            })
        }

        res.json(
            ok:true,
            categorias
        )
    })
})

/* Mostar una categoria por id */
app.get('/categoria/:id', verificationToken (req, res)=>{
    let id = req.params.id
})

/* Crear una nueva categoria */
app.post('/categoria', (req, res)=>{

})

/* Actualizar una categoria */
app.put('/categoria/:id', (req, res)=>{

})

/* Borrar una categoria (eliminado fisico) */
app.delete('/categoria/:id', (req, res)=>{

})



module.exports = app;