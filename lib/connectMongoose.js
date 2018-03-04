'use strict';

const config = require('config');
const mongoose = require('mongoose');
const conn = mongoose.connection;

// manejadores de los eventos de conexión
conn.on('error', console.log.bind(console, 'connection error!'));
conn.on('close', console.log.bind(console, 'connection closed'));

mongoose.Promise = global.Promise;
mongoose.connect(config.DBHost, { useMongoClient: true });
