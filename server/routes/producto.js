
const express = require('express');
const app = express();
const { verificationToken } = require('../middlewares/autenticacion');
const Producto = require('../models/producto');

/* Obtener todos los productos */
app.get('/producto', (req,res)=>{
    /* Traer todos los productos, populate de usuario y categoria y paginacion */
})

/* Obtener un prodcuto por id */
app.get('/producto/:id', (req,res)=>{
    /* populate */
})

/* Crear un nuevo producto */
app.post('/producto', verificationToken, (req, res)=>{
    
    let body = req.body;
    let id = req.usuario._id;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: true,
        categoria: body.categoria,
        usuario: id,
    })

    producto.save( (err, productoBD) => {
        if( err ){
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if( !productoBD ){
            return releaseEvents.status(400).json({
                ok:false,
                err: {
                    message: 'El producto ya existe en los registros'
                }
            })
        }

        res.json({
            ok: true,
            message: 'Producto guardado con exito',
            producto: productoBD
        })
    })

})

/*  Modificar un producto por id */
app.put('/producto/:id', (req,res)=>{
    /* populate */
})

/* Eliminar un producto por id, (eliminacion logica) */
app.delete('/producto/:id', (req,res)=>{
    /* populate */
})





module.exports = app