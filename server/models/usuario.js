
/* Modulos importados */
const mongoose = require('mongoose');
const uniqueValidator= require('mongoose-unique-validator');


/* Variable con los tipos de roles adminitidos, y mensaje en caso de que sea ingresado un rol que no este en el values, para usarlo al atributo role, se le agrega enum:rolesValidos */

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
}

/* Creando un nuevo esquema de usuario */

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario'],
    },
    email: {
        type: String,
        required: [true, 'El correo es necesario'],
        unique:true,
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String,
        required: false
    },
    role:{
        type:String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado:{
        type: Boolean,
        default: true
    },
    google:{
        type:Boolean,
        default: false
    }
});


/* función para retornar el objeto usuario sin la contraseña, esto con el fin de que no sea revelada */

usuarioSchema.methods.toJSON = function(){
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}


/* Mensaje de validación para datos que deben ser únicos en la base de datos */

usuarioSchema.plugin( uniqueValidator, {
    message: '{PATH} debe de ser único'
})

module.exports = mongoose.model( 'Usuario', usuarioSchema );