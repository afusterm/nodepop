'use strict';

/**
 * Your utility library for express
 */

var jwt = require('jsonwebtoken');
var configJWT = require('../local_config').jwt;

var i18n = new (require('i18n-2')) ({
    locales: ['en', 'es']
});

/**
 * JWT auth middleware for use with Express 4.x.
 *
 * @example
 * app.use('/api-requiring-auth', jwtAuth());
 *
 * @returns {function} Express 4 middleware
 */
module.exports = function() {

    return function(req, res, next) {
        let lang = req.query.lang || req.body.lang || req.headers.lang || 'en';

        i18n.setLocale(lang);

        // check header or url parameters or post parameters for token
        var token = req.body.token || req.query.token || req.headers['x-access-token'];

        // decode token
        if (token) {

            // verifies secret and checks exp
            jwt.verify(token, configJWT.secret, function(err, decoded) {
                if (err) {
                    return res.json({ ok: false, error: {code: 401, message: i18n.__('Failed to authenticate token.') }});
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    console.log('decoded', decoded);
                    next();
                }
            });

        } else {

            // if there is no token return error
            return res.status(403).json({
                ok: false,
                error: { code: 403, message: i18n.__('No token provided.')}
            });

        }
    };
};
