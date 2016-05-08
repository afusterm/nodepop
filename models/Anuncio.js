'use strict';

var mongoose = require('mongoose');

var anuncioSchema = mongoose.Schema({
    nombre: String,
    venta: Boolean,
    precio: Number,
    foto: String,
    tags: [String]
});

/**
 *  Lista los anuncios.
 *
 *  @param filter Criterio de búsqueda de anuncios (tag, venta, nombre, precio, etc).
 *  @param start Anuncio desde el que comienza el listado.
 *  @param limit Número máximo de anuncios que devuelve la función.
 *  @param sort Indica el campo por el que se ordenarán los anuncios.
 *  @param callback Función que se llamará al finalizar el listado.
 */
anuncioSchema.statics.list = function(filter, start, limit, sort, callback) {
    var query = Anuncio.find(filter);
    query.skip(start);
    query.limit(limit);
    query.sort(sort);
    return query.exec(callback);
};

var Anuncio = mongoose.model('Anuncio', anuncioSchema);
