'use strict';

// create the connection to nodepop database
var mongo = require('mongodb').MongoClient;
var fs = require('fs');
var readline = require('readline');

mongo.connect('mongodb://localhost:27017/nodepop', function(err, db) {
    if (err) {
        console.error('Bad URL: ', err);
        process.exit(1);
        return;
    }

    let rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    rl.question('Se van a borrar las colecciones de usuarios y anuncios. ¿Continuar? [s/n] ', answer => {
        if (answer === 'S' || answer === 's') {
            // borrar la colección de usuarios
            db.collection('usuarios').drop();
            // borrar la colección de anuncios
            db.collection('anuncios').drop();
        }

        loadUsers(db)
            .then(loadAdvertisements)
            .then(disconnect)
            .catch(function(err) {
                console.error(err);
            });

        rl.close();
    });
});

function loadUsers(db) {
    return new Promise(function(resolve, reject) {
        fs.readFile('usuarios.json', function(err, data) {
            if (err) {
                return reject(new Error('Error reading usuarios.json: ', err));
            }

            // obtener el objeto JSONa partir de los datos leídos
            let jsonData = JSON.parse(data);

            // crear la colección de usuarios
            db.createCollection('usuarios', function(err, collection) {
                if (err) {
                    return reject(new Error('Error creating collection usuarios: ', err));
                }

                // insertar los datos en la colección de usuarios
                collection.insert(jsonData);

                resolve(db);
            });
        });
    });
}

function loadAdvertisements(db) {
    return new Promise(function(resolve, reject) {
        fs.readFile('anuncios.json', function(err, data) {
            if (err) {
                return reject(new Error('Error reading anuncios.json: ', err));
            }

            // obtener el objeto JSONa partir de los datos leídos
            let jsonData = JSON.parse(data);

            // crear la colección de anuncios
            db.createCollection('anuncios', function(err, collection) {
                if (err) {
                    return reject(new Error('Error creating collecion anuncios: ', err));
                }

                // insertar datos en la colección de anuncios
                collection.insert(jsonData);

                resolve(db);
            });
        });
    });
}

function disconnect(db) {
    return new Promise(function(resolve, reject) {
        db.close(false, function(err, result) {
            if (err) {
                return reject(new Error('Error closing db connection: '), err);
            }

            resolve();
        });
    });
}