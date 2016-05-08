'use strict';

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var PushToken = mongoose.model('PushToken');
var Usuario = mongoose.model('Usuario');

var i18n = new (require('i18n-2')) ({
    locales: ['en', 'es']
});


/**
 *  Guarda en la colección pushtokens el token de push para notificaciones a dispositivos Android e IOS.
 *
 *  @param plataforma Nombre de la plataforma que recibirá notifiaciones. Valores posibles: android, ios
 *  @param token Token de la plataforma para enviar notifiaciones.
 *  @param usuario Parámetro opcional para indicar a qué usuario pertenece el token de push.
 */
router.get('/', function(req, res) {
    let pushtoken = new PushToken(req.query);
    let usuario = pushtoken.usuario || null;
    let lang = req.query.lang || 'en';

    i18n.setLocale(lang);

    // función manejadora del método save del modelo
    function saveCallback(err, saved) {
        if (err) {
            return res.json({ success: false, error: i18n.__(err.message) });
        }

        res.json({ success: true, saved });
    }
    
    // validar que los campos obligatorios estén informados
    let errors = pushtoken.validateSync();
    if (errors) {
        return res.json({ success: false, error: i18n.__(errors.message) });
    }

    if (usuario !== null) {
        // si viene informado el usuario, comprobar que existe en la colección de usuarios
        Usuario.findOne({ _id: usuario }, function(err, user) {
            if (err) {
                // el usuario no existe en la base de datos de usuario. Se devuelve error.
                return res.json({ success: false, error: i18n.__('User %s does not exist', usuario) });
            }

            pushtoken.save(saveCallback);
        });
    } else {
        pushtoken.save(saveCallback);
    }
});

module.exports = router;
