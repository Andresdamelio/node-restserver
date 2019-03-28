
/* 
=================== Puerto ==================
*/

process.env.PORT = process.env.PORT || 3000;


/* 
=================== Entorno ==================
*/

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


/* 
=================== Expiracion token ==================
*/
process.env.EXPIRATION_TOKEN = 60 * 60 * 24;

/* 
=================== Semilla de autenticación ==================
*/
process.env.SEED = process.env.SEED || 'secret-seed-development';



/* 
=================== Base de datos ==================
*/

let urlDB;

if ( process.env.NODE_ENV == 'dev' ) {
    urlDB = 'mongodb://172.17.0.2:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.urlDB = urlDB; 