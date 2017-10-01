'use strict';

const SALT_ROUNDS = 10;

var express = require('express');
var router = express.Router();

var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var config = require('../../../local_config');

var mongoose = require('mongoose');
var Usuario = mongoose.model('Usuario');

var i18n = new (require('i18n-2')) ({
    locales: ['en', 'es']
});

/**
 *  Registro de nuevos usarios. Los parámetros se pasan en el body del método POST.
 *
 *  @param nombre Nombre completo del nuevo usuario.
 *  @param email Correo electrónico del nuevo usuario.
 *  @param clave Contraseña del nuevo usuario.
 */
router.post('/', function(req, res) {
    let usuario = new Usuario(req.body);
    let lang = req.body.lang || 'en';

    i18n.setLocale(lang);

    // validar que los campos obligatorios estén informados
    let errors = usuario.validateSync();
    if (errors) {
        return res.status(400).json({ success: false, error: i18n.__(errors.message )});
    }

    // encriptar la clave del usuario
    bcrypt.hash(usuario.clave, SALT_ROUNDS, function(err, hash) {
        usuario.clave = hash;

        // guardar el usuario en la base de datos
        usuario.save(function(err, saved) {
            if (err) {
                return res.status(400).json({ success: false, error: i18n.__(err.message) });
            }

            res.json({ success: true, saved: saved });
        });
    });
});

/**
 *  Autenticación de usuario.
 *
 *  @param email Correo electrónico del usuario.
 *  @param clave Contraseña del usuario.
 *  @param lang Idioma de los mensajes de error. (Parámetro opcional).
 */
router.post('/authenticate', function(req, res) {
    let email = req.body.email || null;
    let clave = req.body.clave || null;
    let lang = req.body.lang || 'en';

    i18n.setLocale(lang);

    if (email === null || clave === null) {
        return res.json({ success: false, error: i18n.__('Email and password are required') });
    }

    Usuario.findOne({ email: email }, function(err, usuario) {
        if (err) {
            return res.status(401).json({ success: false, error: err });
        }

        if (!usuario) {
            return res.status(401).json({ success: false, error: i18n.__('Auth failed. User not found') });
        }

        // comprobar la contraseña
        bcrypt.compare(clave, usuario.clave, function(err, resbcrypt) {
            if (err) {
                return res.status(401).json({ success: false, error: err });
            }

            if (resbcrypt) {
                let token = jwt.sign({ id:usuario._id }, config.jwt.secret, {
                    expiresIn: 60 * 24 * 2     // expira en dos días
                });

                res.json({ success: true, token: token });
            } else {
                res.status(401).json({ success: false, error: i18n.__('Auth failed. Invalid password.') });
            }
        });
    });
});

module.exports = router;
