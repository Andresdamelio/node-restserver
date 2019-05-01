
const express = require('express');
const app = express();
const { verificationToken } = require('../middlewares/autenticacion');
const Producto = require('../models/producto');

/* Obtener todos los productos */
app.get('/producto', verificationToken, (req,res)=>{

    let limite = req.query.limite || 5;
    limite = Number(limite);

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({})
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre, email')
        .skip(desde)
        .limit(limite)
        .exec( (err, productos) => {
            if( err ){
                return res.status(500).json({
                    ok:false,
                    err
                })
            }

            if( !productos ){
                res.status(400).json({
                    ok:false,
                    err: {
                        message: 'No hay productos disponibles'
                    }
                })
            }

            res.json({
                ok:true,
                productos
            })
        })
    /* Traer todos los productos, populate de usuario y categoria y paginacion */
})

/* Obtener un prodcuto por id */
app.get('/producto/:id', verificationToken, (req,res)=>{
    
    let id = req.params.id;

    Producto.findById(id)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre, email')
        .exec( (err, productoBD) =>{
            if( err ){
                return res.status(500).json({
                    ok:false,
                    err
                })
            }

            if( !productoBD ){
                res.status(400).json({
                    ok:false,
                    err: {
                        message: 'No existe un producto con el id indicado'
                    }
                })
            }

            res.json({
                ok:true,
                producto: productoBD
            })
        })
    
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
app.put('/producto/:id', verificationToken, (req,res)=>{
    /* populate */
})

/* Eliminar un producto por id, (eliminacion logica) */
app.delete('/producto/:id', verificationToken, (req,res)=>{
    /* populate */
})





module.exports = app