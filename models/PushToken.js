'use strict';

var mongoose = require('mongoose');

var pushTokenSchema = mongoose.Schema({
    plataforma: {
        type: String,
        enum: ['ios', 'android'],
        required: true
    },
    token: {
        type: String,
        required: true
    },
    usuario: String
});

mongoose.model('PushToken', pushTokenSchema);
