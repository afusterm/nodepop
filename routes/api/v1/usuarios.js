'use strict';

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');
const Usuario = mongoose.model('Usuario');
const i18n = new (require('i18n-2')) ({
    locales: ['en', 'es']
});
const HttpStatus = require('http-status-codes');

/**
 *  Registro de nuevos usarios. Los parámetros se pasan en el body del método POST.
 *
 *  @param nombre Nombre completo del nuevo usuario.
 *  @param email Correo electrónico del nuevo usuario.
 *  @param clave Contraseña del nuevo usuario.
 */
router.post('/', function(req, res) {
    const usuario = new Usuario(req.body);
    const lang = req.body.lang || 'en';

    i18n.setLocale(lang);

    // validar que los campos obligatorios estén informados
    const errors = usuario.validateSync();
    if (errors) {
        return res.status(HttpStatus.BAD_REQUEST).json({ success: false, error: i18n.__(errors.message )});
    }

    Usuario.findOne({ email: usuario.email }, (err, user) => {
        // si el usuario existe devolver error
        if (user != null) {
            return res.status(HttpStatus.CONFLICT).json({ success: false, error: i18n.__(`Email ${usuario.email} already exists`) })
        }

        // encriptar la clave del usuario
        bcrypt.hash(usuario.clave, config.SALT_ROUNDS, function(err, hash) {
            usuario.clave = hash;

            // guardar el usuario en la base de datos
            usuario.save(function(err, saved) {
                if (err) {
                    return res.status(HttpStatus.BAD_REQUEST).json({ success: false, error: i18n.__(err.message) });
                }

                res.json({ success: true, saved: saved });
            });
        });
    })
});

/**
 *  Autenticación de usuario.
 *
 *  @param email Correo electrónico del usuario.
 *  @param clave Contraseña del usuario.
 *  @param lang Idioma de los mensajes de error. (Parámetro opcional).
 */
router.post('/authenticate', function(req, res) {
    const email = req.body.email;
    const clave = req.body.clave;
    const lang = req.body.lang || 'en';

    i18n.setLocale(lang);

    if (email === undefined || clave === undefined) {
        return res.status(HttpStatus.BAD_REQUEST).json({ success: false, error: i18n.__('Email and password are required') });
    }

    Usuario.findOne({ email: email }, function(err, usuario) {
        if (err) {
            return res.status(HttpStatus.UNAUTHORIZED).json({ success: false, error: err });
        }

        if (!usuario) {
            return res.status(HttpStatus.UNAUTHORIZED).json({ success: false, error: i18n.__('Auth failed. User not found') });
        }

        // comprobar la contraseña
        bcrypt.compare(clave, usuario.clave, function(err, resbcrypt) {
            if (err) {
                return res.status(HttpStatus.UNAUTHORIZED).json({ success: false, error: err });
            }

            if (resbcrypt) {
                const TWO_DAYS = 60 * 24 * 2
                const token = jwt.sign({ id:usuario._id }, config.jwt.secret, {
                    expiresIn: TWO_DAYS
                });

                res.json({ success: true, token: token });
            } else {
                res.status(HttpStatus.UNAUTHORIZED).json({ success: false, error: i18n.__('Auth failed. Invalid password.') });
            }
        });
    });
});

module.exports = router;
