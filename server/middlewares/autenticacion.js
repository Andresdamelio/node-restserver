
/* libreria */
const jwt = require('jsonwebtoken');


/*  Verificar token  */

let verificationToken = ( req, res, next ) =>{

    let token = req.get('token');
    
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        
        if( err ){
            return res.status(401).json({
                ok:false,
                err: {
                    message: 'token no valido'
                }
            })
        }

        req.usuario = decoded.usuario;
        next();
    })
};

/*  Verificar rol administrador */

let verificationAdmin = ( req, res, next ) =>{
    
    let usuario = req.usuario;

    if(usuario.role !== 'ADMIN_ROLE'){
        return res.json({
            ok:false,
            err: {
                message: 'Acción permitida solo para administradores'
            }
        });
    }
    next();
}

module.exports = {
    verificationToken,
    verificationAdmin
}