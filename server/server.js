
/* Archivo de configuración(produccion y desarrollo)  */
require('./config/config');

/* Paquetes importados */
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

/* Inicialización de express */
const app = express();

/*  parse application/x-www-form-urlencode */
app.use(bodyParser.urlencoded({ extended: false}));

/* parse application/json */
app.use(bodyParser.json());

/* habilitar carpeta public */

app.use( express.static( path.resolve( __dirname, '../public' ) ) );

app.use(require('./routes/index'));
   

mongoose.connect(process.env.urlDB, 
                { useNewUrlParser: true, useCreateIndex: true },
                (err, res)=>{
    
    if ( err ){
        throw err;
    }

    console.log('Base de datos online');
});
 
app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto 3000');
})