'use strict';

// esta prueba es para ejecutarla individualmente sin necesidad de tener levantada la aplicación

// conexión con la base de datos
require('../lib/connectMongoose');

// modelos
require('../models/Anuncio');

var mongoose = require('mongoose');
var Anuncio = mongoose.model('Anuncio');

function testSave(callback) {
    let anuncioMacBook = new Anuncio({
        nombre: 'MacBook Pro 13',
        venta: true,
        precio: 1300,
        foto: 'mbpro13.jpg',
        tags: ['portatiles','apple', 'informatica']
    });

    anuncioMacBook.save(function(err, anuncio) {
        if (err) {
            return callback(new Error(err));
        }

        console.log('Anuncio ', anuncio.nombre, ' creado');
        callback(null);
    });
}

testSave(function(err) {
    if (err) {
        console.error(err);
    }
    
    mongoose.connection.close();
});
