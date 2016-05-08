'use strict';

var express = require('express');
var router = express.Router();
var jwtAuth = require('../../../lib/jwtAuth');

var mongoose = require('mongoose');
var Anuncio = mongoose.model('Anuncio');

var i18n = new (require('i18n-2')) ({
    locales: ['en', 'es']
});

router.use(jwtAuth());

/**
 *   Lista todos los anuncios que cumplan con las condiciones indicadas.
 *
 *   @param start Número de registro a partir del cual mostrar el listado.
 *   @param limit Número de registros a listar.
 *   @param nombre Texto por el que comienza el nombre de los artículos a mostrar.
 *   @param venta Indica si es un artículo que se quiere vender(venta=true) o si se quiere comprar(venta=false).
 *   @param precio Precio exacto de los artículos a mostrar o rango de precios de la forma [precio_minimo]-[precio_maximo].
 *   Ej: precio=100-200 muestra artículos con un precio entre 100 y 200 euros (100 y 200 incluidos).
 *   Ej: precio=100- muestra artículos con un precio mayor o igual a 100 euros.
 *   Ej: precio=-200 muestra artículos con un precio menor o igual a 200 euros.
 *   Ej: precio=200 muestra todos los artículos con un precio de 200 euros.
 *   @param tags Muestra los anuncios que contengan la etiqueta o etiquetas indicadas.
 */
router.get('/', function(req, res) {
    let start = parseInt(req.query.start) || 0;
    let limit = parseInt(req.query.limit) || null;
    let nombre = req.query.nombre;
    let venta =  req.query.venta;
    let precio = req.query.precio || null;
    let tag = req.query.tag || null;
    let sort = req.query.sort || null;

    i18n.setLocaleFromQuery(req);

    var filters = {};

    if (typeof nombre !== 'undefined') {
        filters.nombre = new RegExp('^' + nombre, 'i');
    }

    if (typeof venta !== 'undefined') {
        filters.venta = venta;
    }

    if (precio !== null) {
        let precios = precio.split('-');
        let precioDesde = parseInt(precios[0]) || 0;
        let precioHasta = parseInt(precios[1]) || 0;

        if (precioDesde === 0) {
            filters.precio = { $lte: precioHasta };
        } else if (precioHasta === 0) {
            filters.precio = { $gte: precioDesde };
        } else {
            filters.precio = { $gte: precioDesde, $lte: precioHasta };
        }
    }
    
    if (tag !== null) {
        if (Array.isArray(tag)) {
            // cuando son varias etiquetas vienen en un array. $in solo se puede utilizar con arrays
            filters.tags = {$in: tag};
        } else {
            // una etiqueta
            filters.tags = tag;
        }
    }

    Anuncio.list(filters, start, limit, sort, function(err, rows) {
        if (err) {
            return res.json({ success: false, error: i18n.__(err.message) });
        }

        res.json({ success: true, rows: rows });
    });
});

module.exports = router;
