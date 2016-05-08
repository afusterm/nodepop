'use strict';

const DB_URL = 'mongodb://localhost:27017/nodepop';

var mongoose = require('mongoose');
var conn = mongoose.connection;

// manejadores de los eventos de conexión
conn.on('error', console.log.bind(console, 'connection error!'));

conn.once('open', function() {
    console.log('Connected to ', DB_URL);
});

conn.on('close', console.log.bind(console, 'connection closed'));

// conectar con la base de datos de nodepop
mongoose.connect(DB_URL);
