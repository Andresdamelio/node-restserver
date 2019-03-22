
/* Archivo de configuración(produccion y desarrollo)  */
require('./config/config');

/* Paquetes importados */
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

/* Inicialización de express */
const app = express();

/*  parse application/x-www-form-urlencode */
app.use(bodyParser.urlencoded({ extended: false}));

/* parse application/json */
app.use(bodyParser.json());


app.use(require('./routes/usuario'));
   

mongoose.connect('mongodb://172.17.0.2:27017/cafe', (err, res)=>{
    
    if ( err ){
        throw err;
    }

    console.log('Base de datos online');
});
 
app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto 3000');
})