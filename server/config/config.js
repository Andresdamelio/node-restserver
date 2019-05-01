
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
// process.env.EXPIRATION_TOKEN = 60 * 60 * 24 * 30;

process.env.EXPIRATION_TOKEN = '48h';

/* 
=================== Semilla de autenticación ==================
*/
process.env.SEED = process.env.SEED || 'secret-seed-development';

/* 
=================== Google client id==================
*/
process.env.CLIENT_ID = process.env.CLIENT_ID || '863784944024-dgkuh4mtu4mqec3rjhuthumo27hh18p2.apps.googleusercontent.com';

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