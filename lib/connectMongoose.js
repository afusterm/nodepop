'use strict';

const config = require('config');

var mongoose = require('mongoose');
var conn = mongoose.connection;

// manejadores de los eventos de conexión
conn.on('error', console.log.bind(console, 'connection error!'));

/* XXX
conn.once('open', function() {
    console.log('Connected to ', config.DBHost);
});*/

conn.on('close', console.log.bind(console, 'connection closed'));

mongoose.Promise = global.Promise;

// conectar con la base de datos de nodepop
mongoose.connect(config.DBHost, { useMongoClient: true });
