'use strict';

var express = require('express');
var path = require('path');
const morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const cors = require('cors');
const config = require('config');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

var i18n = new (require('i18n-2')) ({
    locales: ['en', 'es']
});

if (config.util.getEnv('NODE_ENV') !== 'test') {
    //use morgan to log at command line
    app.use(morgan('combined')); //'combined' outputs the Apache style LOGs
}


// conexión con la base de datos
require('./lib/connectMongoose');

// modelos
require('./models/Anuncio');
require('./models/Usuario');
require('./models/PushToken');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// rutas del API
app.use('/api/v1/anuncios', require('./routes/api/v1/anuncios'));
app.use('/api/v1/usuarios', require('./routes/api/v1/usuarios'));
app.use('/api/v1/pushtoken', require('./routes/api/v1/pushtoken'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    let lang = req.headers.lang || 'en';
    i18n.setLocale(lang);

    return res.status(404).json({success: false, error: i18n.__('Path does not exist')});
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
