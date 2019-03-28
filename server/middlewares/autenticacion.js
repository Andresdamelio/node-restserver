
/* libreria */
const jwt = require('jsonwebtoken');


/*  Verificar token  */

let verificationToken = ( req, res, next ) =>{

    let token = req.get('token');
    
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        
        if( err ){
            return res.status(401).json({
                ok:false,
                err
            })
        }

        req.usuario = decoded.usuario;
        next();
    })
};

module.exports = {
    verificationToken
}