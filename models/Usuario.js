'use strict';

var mongoose = require('mongoose');

var usuarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        index: true
    },
    clave: {
        type: String,
        required: true
    }
});

mongoose.model('Usuario', usuarioSchema);
